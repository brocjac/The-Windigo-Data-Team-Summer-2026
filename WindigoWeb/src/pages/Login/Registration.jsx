import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import { registerWorker } from '../../data/api'

function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const validate = () => {
    const nextErrors = {}

    if (!form.firstName.trim()) {
      nextErrors.firstName = 'First name is required.'
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.'
    }

    if (form.password.length < 8) {
      nextErrors.password =
        'Password must be at least 8 characters.'
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword =
        'Passwords do not match.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      setStatus('Please correct the required fields.')
      return
    }

    try {
      const newWorker = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password
      }

      console.log('Registration:', newWorker)

      const savedWorker = await registerWorker(newWorker)

      console.log('Saved worker:', savedWorker)

      setStatus('Registration submitted. Your account will need approval before you can sign in.')

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })

      setErrors({})
    }
    catch (error) {
      console.error('Registration failed:', error)
      setStatus('Registration failed.')
    }
  }
  return (
    <div className='page'>
      <div className="page__header">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Create Account</h2>
        </div>
      </div>

      <FormCard title="Worker Registration"  description="Create an account to access The Ponds forms and maintenance tools.">
        <form className='form-grid' onSubmit={handleSubmit}>
          <label className='field'>
            <span>First Name</span>
            <input type='text' value={form.firstName} onChange={(event) => setForm({...form, firstName: event.target.value})}/>
            {errors.firstName && (<small>{errors.firstName}</small>)}
          </label>
          <label className='field'>
            <span>Last Name</span>
            <input type='text' value={form.lastName} onChange={(event) => setForm({...form, lastName: event.target.value})}/>
            {errors.lastName && (<small>{errors.lastName}</small>)}
          </label>
          <label className='field'>
            <span>Email</span>
            <input type='email' value={form.email} onChange={(event) => setForm({...form, email: event.target.value})}/>
            {errors.email && (<small>{errors.email}</small>)}
          </label>
          <label className='field'>
            <span>Password</span>
            <input type='password' value={form.password} onChange={(event) => setForm({...form, password: event.target.value})}/>
            {errors.password && (<small>{errors.password}</small>)}
          </label>
          <label className='field'>
            <span>Confirm Password</span>
            <input type='password' value={form.confirmPassword} onChange={(event) => setForm({...form, confirmPassword: event.target.value})}/>
            {errors.confirmPassword && (<small>{errors.confirmPassword}</small>)}
          </label>
          {status && (<p className={`status ${status.includes('submitted') ? 'status--success' : 'status--error'}`}>{status}</p>)}
          <div className='form-action'>
            <button className='button button-primary' type='submit'>Create Account</button>
          </div>
          <p>Already have an account?{' '}<Link to='/login'>Sign In</Link></p>
        </form>
      </FormCard>
    </div>
  )
}
export default Register