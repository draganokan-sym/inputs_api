import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { mockOptions, validate } from './App'
import Typeahead from './components/Typahead'

type FormData = {
  tags: string[]
  state: string
}

const RHFForm: React.FC = () => {

  const { handleSubmit, errors, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      tags: [],
      state: ''
    },
    resolver: async (values) => {
      return {
        values: {},
        errors: {
          state: {
            type: 'validation',
            message: validate(values.state)[0]
          },
        }
      }
    }
  })

  const onSubmit = handleSubmit((data: FormData) => console.log(data));

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Controller
          as={Typeahead}
          control={control}
          name="state"
          options={mockOptions}
          errors={errors.state ? [errors.state.message || ''] : []}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  )
}
export default RHFForm