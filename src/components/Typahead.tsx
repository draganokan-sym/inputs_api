import React, { useImperativeHandle, useRef, forwardRef, useState, useEffect } from 'react'
import { Props, RefInterface } from '../App';

type TypeaheadProps = Props<string> & {
  options: string[]
}

const Typeahead = forwardRef<RefInterface<string>, TypeaheadProps>((props, ref) => {

  // @ts-ignore
  const isControlled = props.defaultValue === undefined
  // @ts-ignore
  const [state, _setState] = useState({
    // @ts-ignore
    value: (isControlled ? props.value : props.defaultValue) as string,
    // @ts-ignore
    // pending: props.pending || false,
    // @ts-ignore
    dirty: props.dirty || false,
    // @ts-ignore
    touched: props.touched || false,
    // @ts-ignore
    errors: props.errors || [],
  })


  const setState = (newState: Partial<typeof state>) => _setState({
    ...state,
    ...newState
  })

  useEffect(() => {
    isControlled && setState({
      value: props.value || state.value,
      dirty: props.dirty || state.dirty,
      touched: props.touched || state.touched,
      errors: props.errors || state.errors,
    })
  }, [props.value, props.dirty, props.errors, props.touched])

  const changeHandler = (value: string) => {
    setState({
      value,
      dirty: true
    })
    isControlled && props.onChange && props.onChange(value)
  }

  const focusHandler = () => {
    setState({
      ...state,
      touched: true
    })
    isControlled && props.onFocus && props.onFocus()
  }

  const blurHandler = () => {
    isControlled && props.onBlur && props.onBlur()
  }

  const inputRef = useRef<any>()

  useImperativeHandle(ref, () => ({
    value: state.value,
    // pending: state.pending,
    touched: state.touched,
    dirty: state.dirty,
    errors: state.errors,
    focus: () => { inputRef.current?.focus(); },
    blur: () => { inputRef.current?.blur(); },
    setValue: (value: string) => setState({ value }),
    // setPending: (pending: boolean) => setState({ pending }),
    setDirty: (dirty: boolean) => setState({ dirty }),
    setTouched: (touched: boolean) => setState({ touched }),
    setErrors: (errors: string[]) => setState({ errors }),
  }), [state]);

  const suggestion = state.value.length
    ? props.options.filter(suggestion => suggestion.toLowerCase().match(state.value.toLowerCase()))[0] || ''
    : ''

  const keyUpHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestion) {
      setState({
        value: suggestion
      })
    }
  }

  return (
    <div>
      <div className={["typeahead", state.errors.includes('no_option') ? 'invalid' : ''].join(' ')}>
        <input
          value={state.value}
          ref={inputRef}
          onKeyUp={keyUpHandler}
          onChange={e => changeHandler(e.target.value)}
          spellCheck={false}
          onFocus={focusHandler}
          onBlur={blurHandler}
        />
        <div><strong>{state.value}</strong>{suggestion ? suggestion.substr(state.value.length) : ''}</div>
      </div>
      <div><pre>{
        JSON.stringify(state, null, 4)}</pre></div>
    </div>
  )
})

export default Typeahead