import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Table,
  Snackbar,
  Input,
  Button,
  Textarea,
  Select,
  Option,
  FormControl,
  FormLabel
} from '@mui/joy';
import { loginSuccess } from '../app/features/Auth/actions';
import authController from '../app/api/auth/authController';
const Login = () => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
   const isLogin = useSelector(state => state.auth.isLogin); // Get login status from Redux store
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for dynamic Snackbar message
  const [snackbarColor, setSnackbarColor] = useState(''); // State for dynamic Snackbar message
  
  const [login, setLogin] = useState({
    email: '',
    password: ''
  });
   const [errors, setErrors] = useState({}); // State for error messages
    const validate = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!login.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(login.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!login.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };
   useEffect(() => {
    if (isLogin) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [])
const handleInputChange = e => {
    const { name, value } = e.target;
    setLogin(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error when user types
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if there are validation errors
    }
    console.log(login)
   
        const response = await authController.login(login);
        console.log(response)
        if (response.error === 1) {
          setSnackbarMessage(response.message);
          setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('danger')

        } else {
          setSnackbarMessage(response.message);
           setSnackbarOpen(true); // Open Snackbar on success
          setSnackbarColor('success');
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setTimeout(() => {
            navigate('/');
          }, 500)
        }
    
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close Snackbar
  };
  return (
    <div>
      <Box
        border={1}
        borderColor={'darkgray'}
        overflow={'hidden'}
        borderRadius={'5px'}
        marginTop={'80px'}
        width={'60%'}
        marginX={'auto'}
      >
        <Box
          borderBottom={1}
          borderColor={'darkgray'}
          width={'100%'}
          padding={'8px'}
          sx={{
            backgroundColor: '#eee'
          }}
        >
          <Typography fontWeight={'bold'}> Login</Typography>
        </Box>
        <Box padding={'10px'}>
          <form onSubmit={handleSubmit} action=''>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
              
                placeholder='Alamat Email'
                name='email'
                type='email'
                value={login.email}
                onChange={handleInputChange}
                sx={{ marginBottom: '10px' }}
              />
               {errors.email && <Typography fontSize={14} color='danger'>{errors.email}</Typography>}
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
               
                placeholder='Password'
                name='password'
                type='password'
                value={login.password}
                onChange={handleInputChange}
                sx={{ marginBottom: '10px' }}
              />
               {errors.password && <Typography  fontSize={14} color='danger'>{errors.password}</Typography>}
            </FormControl>
            <Button variant='solid' color='neutral'   sx={{ marginY: '10px' }}  type='submit'>
              Login
            </Button>
          </form>
          <p >Belum punya akun? <a href="/register">Daftar</a></p>
        </Box>
      </Box>
       <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        color={snackbarColor}
        variant='solid'
        autoHideDuration={3000} // Closes automatically after 3 seconds
        message={ snackbarMessage} // Message to display
      > { snackbarMessage} </Snackbar>
    </div>
  )
}

export default Login
