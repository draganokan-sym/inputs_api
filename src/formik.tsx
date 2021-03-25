import { useFormik } from 'formik'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { mockOptions, validate } from './App'
import Typeahead from './components/Typahead'

type FormData = {
  tags: string[]
  state: string
}

const FormikForm: React.FC = () => {
  const formik = useFormik<FormData>({
    initialValues: {
      state: '',
      tags: []
    },
    validateOnChange: true,
    validateOnBlur: false,
    validateOnMount: false,
    validate: async (vals) => {
      return {
        state: validate(vals.state)[0]
      }
    },
    onSubmit: (vals) => {
      console.log(vals)
    }
  })
  return (
    <div>
      <Typeahead
        options={mockOptions}
        value={formik.values.state}
        onChange={(val) => {
          formik.setFieldValue('state', val)
        }}
        errors={formik.errors.state ? [formik.errors.state] : []}
      />
      <button type="submit">submit</button>
    </div>
  )
}

export default FormikForm