import { useId } from "react";

// Shared form controls for the public site: one label, hint and error
// treatment, one focus style (defined once under `.mk-field` in globals.css).
// Every form (contact, future quote forms) should use these instead of
// hand-rolled inputs.
//
//   <Field label="Email" type="email" name="email" required autoComplete="email" />
//   <Field as="textarea" label="Message" rows={5} />
//   <Field as="select" label="Package" optional><option value="">Choose…</option></Field>

export default function Field({ as = "input", label, hint, error, optional = false, className = "", children, ...props }) {
  const id = useId();
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const Control = as;

  return (
    <div className={`mk-field ${error ? "has-error" : ""} ${className}`}>
      {label ? (
        <label htmlFor={id} className="mk-field-label">
          {label}
          {optional ? <span className="mk-field-optional"> (optional)</span> : null}
        </label>
      ) : null}
      <Control id={id} className={`mk-field-control mk-field-${as}`} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...props}>
        {children}
      </Control>
      {hint && !error ? <p id={`${id}-hint`} className="mk-field-hint">{hint}</p> : null}
      {error ? <p id={`${id}-error`} className="mk-field-error" role="alert">{error}</p> : null}
    </div>
  );
}
