import { useMemo } from 'react';
import { signal } from '@preact/signals-react';
import { useSignals } from '@preact/signals-react/runtime';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  useSignals();
  const form = useMemo(
    () =>
      signal({
        username: '',
        password: '',
        error: '',
      }),
    []
  );
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = form.value;
    if (login(username, password)) {
      navigate('/campaigns');
    } else {
      form.value = { ...form.value, error: 'Invalid credentials' };
    }
  };

  return (
    <div className='container login-container'>
      <h2 id='login-title' className='login-title'>
        Login
      </h2>
      <form
        className='login-form'
        aria-labelledby='login-title'
        onSubmit={handleSubmit}
      >
        <label htmlFor='username-input' className='login-label'>
          Username
        </label>
        <input
          id='username-input'
          type='text'
          className='login-input'
          placeholder='Enter Username'
          value={form.value.username}
          onChange={(e) =>
            (form.value = {
              ...form.value,
              username: e.target.value,
              error: '',
            })
          }
          required
          aria-required='true'
        />
        <label htmlFor='password-input' className='login-label'>
          Password
        </label>
        <input
          id='password-input'
          type='password'
          className='login-input'
          placeholder='Enter Password'
          value={form.value.password}
          onChange={(e) =>
            (form.value = {
              ...form.value,
              password: e.target.value,
              error: '',
            })
          }
          required
          aria-required='true'
          aria-invalid={!!form.value.error}
        />
        <button type='submit' className='login-btn' aria-label='Login'>
          Login
        </button>
      </form>
      {form.value.error && (
        <div className='error' role='alert'>
          {form.value.error}
        </div>
      )}
    </div>
  );
}

export default Login;
