const { subject } = require('@casl/ability');
const Invoice = require('../invoice/model');
const path = require('path');
const { policyFor } = require('../../utils/index');
const fs = require('fs');
const config = require('../../config');
const show = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);
    let { order_id } = req.params;

    // Cari invoice berdasarkan order_id
    let invoice = await Invoice.findOne({ order: order_id })
      .populate('order')
      .populate('user');

    // Periksa apakah invoice ditemukan
    if (!invoice) {
      return res.status(404).json({
        error: 1,
        message: 'Invoice not found',
      });
    }

    // Periksa apakah invoice memiliki user
    if (!invoice.user) {
      return res.status(404).json({
        error: 1,
        message: 'User not found in invoice',
      });
    }

    // Buat subjek untuk validasi kebijakan
    let subjectInvoice = {
      user_id: invoice.user._id, // ID pengguna dari invoice
    };

    console.log('Invoice user ID:', invoice.user._id.toString());
    console.log('Request user ID:', req.user._id);

    // Validasi kebijakan: cek izin membaca
    if (!policy.can('read', subject('Invoice', subjectInvoice))) {
      return res.status(403).json({
        error: 1,
        message: `You're not allowed to perform this action`,
      });
    }

    // Kembalikan data invoice jika lolos validasi
    return res.json(invoice);
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({
      error: 1,
      message: 'Error when getting invoice',
      err: err.message,
    });
  }
};

const update = async (req, res, next) => {
  try {
    let policy = policyFor(req.user);
    let { order_id } = req.params; // Ambil `order_id` dari parameter URL
    let updates = req.body; // Data pembaruan dari permintaan
    console.log(order_id);

    // Cari invoice berdasarkan order_id
    let invoice = await Invoice.findOne({ order: order_id })
      .populate('order')
      .populate('user');

    // Periksa apakah invoice ditemukan
    if (!invoice) {
      return res.status(404).json({
        error: 1,
        message: 'Invoice not found',
      });
    }

    // Periksa apakah invoice memiliki user
    if (!invoice.user) {
      return res.status(404).json({
        error: 1,
        message: 'User not found in invoice',
      });
    }

    // Buat subjek untuk validasi kebijakan
    let subjectInvoice = { user_id: invoice.user._id };

    // Validasi kebijakan: cek izin untuk memperbarui
    if (!policy.can('update', subject('Invoice', subjectInvoice))) {
      return res.status(403).json({
        error: 1,
        message: `You're not allowed to update this invoice`,
      });
    }

    // Jika ada file upload
    if (req.file) {
      let tmpPath = req.file.path;
      let originalExt = path.extname(req.file.originalname); // Ekstensi file asli
      let filename = `${req.file.filename}${originalExt}`;
      let targetPath = path.resolve(
        config.rootPath,
        `public/images/invoices/${filename}`,
      );

      // Pindahkan file ke direktori tujuan
      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          // Hapus file lama jika ada
          if (invoice.uploadBukti && invoice.uploadBukti !== 'default') {
            let currentImage = path.resolve(
              config.rootPath,
              `public/images/invoices/${invoice.uploadBukti}`,
            );
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }
          }

          // Perbarui path uploadBukti di invoice
          invoice.uploadBukti = filename;

          // Simpan perubahan di database
          await invoice.save();

          return res.json({
            success: 1,
            message: 'Update Sukses',
            data: invoice,
          });
        } catch (err) {
          fs.unlinkSync(targetPath); // Hapus file baru jika ada kesalahan
          next(err);
        }
      });

      src.on('error', (err) => {
        next(err);
      });
    } else {
      // Jika tidak ada file upload, hanya perbarui data
      Object.assign(invoice, updates);
      await invoice.save();

      return res.json({
        success: 1,
        message: 'Invoice updated successfully',
        data: invoice,
      });
    }
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({
      error: 1,
      message: 'Error when updating invoice',
      err: err.message,
    });
  }
};

module.exports = {
  show,
  update,
};
