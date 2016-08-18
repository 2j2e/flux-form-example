import {Actions} from './actions'

const defaultForm = () => ({
  isValid: true,
  isLoading: false,
  errors: [], // general form errors
  fields: {}
});

export default function forms(state = {}, action = '') {
  let {payload} = action;

  switch (action.type) {

    case Actions.Forms.AddField:
    {
      let component = {
        value: payload.value || '',
        pristineValue: payload.value || '',
        isPristine: true,
        errors: []
      };
      let form = state[payload.formName] ? Object.assign({}, state[payload.formName]) : defaultForm();
      form.fields[payload.componentName] = component;
      return Object.assign({}, state, {[payload.formName]: form});
    }

    case Actions.Forms.FieldValue:
    {
      let form = _.cloneDeep(state[payload.formName]);
      form.fields[payload.fieldName].value = payload.value;
      form.fields[payload.fieldName].isPristine = false;
      form.fields[payload.fieldName].errors = [];
      return Object.assign({}, state, {[payload.formName]: form});
    }

    case Actions.Forms.RemoveField:
    {
      let form = _.cloneDeep(state[payload.formName]);
      delete form.fields[payload.componentName];
      return Object.assign({}, state, {[payload.formName]: form});
    }

    case Actions.Forms.Loading:
    {
      let form = _.cloneDeep(state[payload.formName]);
      form.isLoading = payload.isLoading;
      return Object.assign({}, state, {[payload.formName]: form});
    }

    case Actions.Forms.ServerErrors:
    {
      let form = _.cloneDeep(state[payload.formName]);
      form.isLoading = false;
      let {response} = payload;
      // 500 error, unhandled exception
      if (typeof response == 'string') {
        form.isValid = false;
        form.errors = response;
      } else {
        form.isValid = response.errors.__all__ && response.errors.__all__.length == 0 && Object.keys(response.errors).length == 0;
        form.errors = response.errors.__all__;
        Object.keys(form.fields).forEach(key => {
          if (key == '__all__') return;
          form.fields[key].errors = response.errors[key] || [];
          form.fields[key].isPristine = false;
        });
      }
      return Object.assign({}, state, {[payload.formName]: form});
    }
    case Actions.Forms.ClientErrors:
    {
      let form = _.cloneDeep(state[payload.formName]);
      let { errors, formName } = payload;
      form.errors = errors && errors.general || [];
      Object.keys(form.fields).forEach(key => {
        form.fields[key].errors = errors && errors.fields && errors.fields[key] ? errors.fields[key] : []
      });
      form.isValid = !form.errors.length && !errors && !Object.keys(errors.fields).length;
      return Object.assign({}, state, {[formName]: form});
    }

    case Actions.Forms.Reset:
    {
      let form = _.cloneDeep(state[payload.formName]);
      form.isValid = true;
      form.errors = [];
      Object.keys(form.fields).forEach(key => {
        form.fields[key].value = form.fields[key].pristineValue;
        form.fields[key].errors = [];
      });
      return Object.assign({}, state, {[payload.formName]: form});
    }

    case Actions.Forms.Validate:
    {
      let form = _.cloneDeep(state[payload.formName]);
      let customValidation = payload.customValidation()
      form.errors = [];

    }

    case Actions.Forms.Destruct:
    {
      let forms = Object.assign({}, state);
      delete forms[payload.formName];
      return forms;
    }

    default:
      return state;
  }
}