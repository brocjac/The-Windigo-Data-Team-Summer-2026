import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import { useNavigate } from 'react-router-dom'
import { loginWorker } from '../../data/api'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const [form, setForm] = useState({email: '', password: ''})
  const { login } = useAuth()

  const [status, setStatus] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const result = await loginWorker({
        email: form.email.trim(),
        password: form.password
      })

      localStorage.setItem('token', result.token)
      localStorage.setItem('worker', JSON.stringify(result.worker))

      setStatus('Login successful.')

      login(result)

      navigate('/')
    }
    catch (error) {
      console.error('Login failed:', error)
      setStatus('Invalid email, password, or account status.')
    }
  }

  return(
    <div className='page'>
      <div className='page__header'>
        <div>
          <p className='eyebrow'>Account</p>
          <h2>Sign In</h2>
        </div>
      </div>

      <FormCard title="Worker Login" description="Sign in to access The Ponds forms and maintenance tools.">
        <form className='form-grid' onSubmit={handleSubmit}>
          <label className='field'>
            <span>Email</span>
            <input type='email' value={form.email} onChange={(event) => setForm({...form, email: event.target.value})}/>
          </label>
          <label className='field'>
            <span>Password</span>
            <input type='password' value={form.password} onChange={(event) => setForm({...form, password: event.target.value})}/>
          </label>
          {status && (
            <p className="status">
              {status}
            </p>
          )}
          <div className="form-actions">
            <button className="button button--primary" type="submit">
              Sign In
            </button>
          </div>
        </form>
        <p>Need an account? <Link to="/register">Register</Link></p>
      </FormCard>
    </div>
  )
}

export default Login