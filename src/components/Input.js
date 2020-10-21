import React from 'react';
import removeEmojis from '../helpers/removerEmoji';
import Error from './errorMessage';
export default function ({
  className = 'form-control',
  value,
  name,
  id,
  type = 'text',
  error,
  disabled = false,
  onChange,
  placeholder,
  maxLength = 55,
  minLength = 3,
  onBlur,
  onFocus,
  onInput,
  style
}) {
  return (
    <div className="input-component">
      <input
        type={type}
        className={className}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        name={name}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        onInput={onInput}
        style={style}
        onChange={(evt) => {
          evt.target.value = evt.target.value.trimStart();
          evt.target.value = removeEmojis(evt.target.value);
          onChange(evt);
        }}
      />
      <Error text={error} />
    </div>
  );
}
