import keyMirror from 'helpers/deepKeyMirror'
import { call, put, take, select } from 'redux-saga/effects'

export const Actions = keyMirror({
  Forms: {
    AddField: null,
    RemoveField: null,
    FieldValue: null,
    Loading: null,
    ClientErrors: null,
    ServerErrors: null,
    Reset: null,
    Destruct: null
  }
});

export function addField(formName, componentName, value) {
  return {
    type: Actions.Forms.AddField,
    payload: {
      formName: formName,
      componentName: componentName,
      value: value
    }
  }
}

export function removeField(formName, componentName) {
  return {
    type: Actions.Forms.RemoveField,
    payload: {
      formName: formName,
      componentName: componentName
    }
  }
}

export function setFieldValue(formName, fieldName, value) {
  return {
    type: Actions.Forms.FieldValue,
    payload: {
      formName: formName,
      fieldName: fieldName,
      value: value
    }
  }
}

export function loading(formName, isLoading) {
  return {
    type: Actions.Forms.Loading,
    payload: {
      formName: formName,
      isLoading: isLoading
    }
  }
}

export function destruct(formName) {
  return {
    type: Actions.Forms.Destruct,
    payload: {
      formName: formName
    }
  }
}

export function reset(formName) {
  return {
    type: Actions.Forms.Reset,
    payload: {
      formName: formName
    }
  }
}

export function clientErrors(formName, errors) {
  return {
    type: Actions.Forms.ClientErrors,
    payload: {
      formName: formName,
      errors: errors
    }
  }
}

export function serverErrors(formName, response) {
  return {
    type: Actions.Forms.ServerErrors,
    payload: {
      formName: formName,
      response: response
    }
  }
}

export function submit(formName, rules, customValidation) {
  return {
    type: Actions.Forms.Submit,
    payload: {
      formName: formName,
      rules: rules,
      customValidation: customValidation
    }
  }
}

export function validate(formName, rules, customValidation) {
  return {
    type: Actions.Forms.Submit,
    payload: {
      formName: formName,
      rules: rules,
      customValidation: customValidation
    }
  }
}

export function* submitWatch() {
  while (true) {
    const action = yield take(Actions.Forms.Submit);
    yield put(validate(action.formName, action.rules, action.customValidation));
    let isValid = yield select(state => state.forms[action.formName].isValid)
    if (!isValid)
      continue;

    yield put(loading(action.formName, true));
    try {
      yield put(action.submit())
      yield put(loading(action.formName, false));
    }
    catch(e) {
      yield put(serverErrors(action.formName, e));
    }
  }
}
