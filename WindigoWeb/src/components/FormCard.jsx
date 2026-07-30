function FormCard({ title, description, children }) {
  return (
    <section className="card form-card">
      <div className="form-card__header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="form-card__body">{children}</div>
    </section>
  )
}

export default FormCard
