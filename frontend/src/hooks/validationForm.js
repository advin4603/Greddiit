import {useEffect, useRef, useState} from "react";
import {useInput} from "@nextui-org/react";

export default function useValidationForm(initialData) {
  const initValidationState = {}
  Object.keys(initialData).forEach(v => initValidationState[v] = false);
  const [validate, setValidate] = useState(initValidationState)
  let bindings = {}
  const data = {}
  const setData = {}
  Object.keys(initialData).forEach(v => {
    const {value, setValue, bindings: elBindings} = useInput(initialData[v])
    data[v] = value;
    setData[v] = (d)=>{
      setValue(d)
      let newValidate = {...validate}
      newValidate[v] = false;
      setValidate(newValidate)
    }

    // fix rerender issue from https://github.com/nextui-org/nextui/issues/975
    // fix by setting validate to false when using setvalue and starting

    if (!validate[v]){
      bindings[v] = {
        ...elBindings,  onChange: (e) => {
          if (!validate[v]) {
            let newValidate = {...validate}
            newValidate[v] = true;
            setValidate(newValidate)
          }
          elBindings.onChange && elBindings.onChange(e)

        }
      }
    } else {
      bindings[v] = {
        ...elBindings, value: undefined, defaultValue: initialData[v], onChange: (e) => {
          if (!validate[v]) {
            let newValidate = {...validate}
            newValidate[v] = true;
            setValidate(newValidate)
          }
          elBindings.onChange && elBindings.onChange(e)

        }
      }
    }

  })
  const setAllValidate = (value) => {
    let newValidate = {}
    Object.keys(initialData).forEach(v => newValidate[v] = value)
    setValidate(newValidate)
  }


  return {data, setData, setAllValidate, validate, bindings}
}