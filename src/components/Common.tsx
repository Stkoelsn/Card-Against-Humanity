import {
  useCheckbox,
  useButton,
  useNumberField,
  useLocale
} from 'react-aria';
import {
  useToggleState,
  useNumberFieldState
} from 'react-stately';
import React, {
  useRef
} from 'react';

export function Checkbox(props: any) {
  let { children } = props;
  let state = useToggleState(props);
  let ref = useRef<HTMLInputElement>(null);
  let { inputProps } = useCheckbox(props, state, ref);

  return (
    <label style={{ display: 'block' }}>
      <input {...inputProps} ref={ref} />
      {children}
    </label>
  );
}

export function Numeric(props: any) {
  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = useRef<HTMLInputElement>(null);
  let {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps
  } = useNumberField(props, state, inputRef);

  return (
    <div>
      <label {...labelProps}>{props.label}</label>
      <div {...groupProps}>
        <Button className='PMbutton' {...decrementButtonProps}>-</Button>
        <input className='PMbutton' {...inputProps} ref={inputRef} />
        <Button className='PMbutton' {...incrementButtonProps}>+</Button>
      </div>
    </div>
  );

}

export function Button(props: any) {
  let ref = useRef<HTMLButtonElement>(null);
  let { buttonProps } = useButton(props, ref);
  let { children } = props;


  return (
    <button className={props.className} {...buttonProps} ref={ref}>
      {children}
    </button>
  );
}
