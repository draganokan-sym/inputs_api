import React, { useRef, useState } from 'react';
import './App.scss';
import Typeahead from './components/Typahead';
import FormikForm from './formik';
import RHFForm from './rhf';

export type RefInterface<T> = {
  value: T
  // pending: boolean
  dirty: boolean
  touched: boolean
  errors: string[]
  focus: () => void
  blur: () => void
  setValue: (value: T) => void
  // setPending: (pending: boolean) => void
  setDirty: (dirty: boolean) => void
  setTouched: (touched: boolean) => void
  setErrors: (errors: string[]) => void
}

export type Props<T> = {
  defaultValue?: T
  value?: T
  onChange?: (value: T) => void
  onFocus?: () => void
  onBlur?: () => void
  // pending?: boolean
  dirty?: boolean
  touched?: boolean
  errors?: string[]
  name?: string
}

export const mockOptions = [
  'California',
  'Delaware',
  'Arizona',
  'New York',
  'Texas'
]

export const validate = (text: string) => {
  const valid = mockOptions.some(option => option.toLowerCase().match(new RegExp("^" + text.toLowerCase())))
  return !valid ? ['no_option'] : []
}

function App() {

  const typaheadRef = useRef<RefInterface<string>>(null)
  const [text, setText] = useState("")
  const [errors, setErrors] = useState<string[]>([])


  return (
    <div className="app">

      <section>
        <h3>controlled</h3>
        <Typeahead
          options={mockOptions}
          value={text}
          onChange={(v: string) => {
            setText(v)
            setErrors(validate(v))
          }}
          onBlur={() => console.log('on blur')}
          onFocus={() => console.log('on focus')}
          errors={errors}
        />
      </section>

      <section>
        <h3>uncontrolled</h3>
        <Typeahead ref={typaheadRef} defaultValue="" options={mockOptions} />
        <button onClick={() => {
          console.log(typaheadRef.current?.value)
        }}>get val</button>
        <button onClick={() => {
          typaheadRef.current?.setValue('tex')
        }}>set val</button>
        <button onClick={() => {
          typaheadRef.current?.setErrors(['omg', 'lol'])
        }}>set errors</button>
        <button onClick={() => {
          typaheadRef.current?.setDirty(!typaheadRef.current.dirty)
        }}>toggle dirty</button>
        <button onClick={() => {
          typaheadRef.current?.focus()
        }}>focus</button>
        <button onClick={() => {
          const val = typaheadRef.current?.value!
          const errs = validate(val)
          typaheadRef.current?.setErrors(errs)
        }}>validate</button>
      </section>

      <section>
        <h3>react-hook-form (controlled)</h3>
        <RHFForm />
      </section>

      <section>
        <h3>formik (controlled)</h3>
        <FormikForm />
      </section>
    </div>
  );
}

export default App;
