import React from 'react'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {Alert} from 'components/controls'
import * as FormsActions from './actions'

@connect(state => ({
  forms: state.forms
}), dispatch => ({
  actions: bindActionCreators(FormsActions, dispatch)
}), null, {withRef: true})
export default class ValidationForm extends React.Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onInitialized: React.PropTypes.func,
    onCustomValidation: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    onValidSubmit: React.PropTypes.func,
    onReset: React.PropTypes.func,
    disabled: React.PropTypes.bool,
  };

  static childContextTypes = {
    form: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    // Form component refs
    this.isInitialized = false;
    this.fields = {}
  }

  getChildContext() {
    return {
      form: {
        addField: this.addField,
        removeField: this.removeField,
        setFieldValue: this.setFieldValue,
        getField: this.getField
      }
    }
  }

  componentWillUnmount() {
    this.props.actions.destruct(this.props.name);
  }

  componentDidUpdate(nextProps) {
    if (!this.isInitialized && this.getForm()) {
      this.props.onInitialized && this.props.onInitialized();
      this.isInitialized = true;
    }
  }

  // -----------------------------------
  // Form context methods for components
  // -----------------------------------

  addField = (field) => {
    this.fields[field.props.name] = field;
    this.props.actions.addField(this.props.name, field.props.name, field.props.value);
  };

  removeField = (name) => {
    delete this.fields[name];
    this.props.actions.removeField(this.props.name, name);
  }

  getField = (name) => {
    return this.getForm() ? this.getForm().fields[name] : undefined;
  }

  setFieldValue = (name, value) => {
    this.props.actions.setFieldValue(this.props.name, name, value);
  }

  /**
   * Pure form data
   * @returns {[fieldName]: value}
   * @private
   */
  getFormData() {
    let data = {},
      fields = this.getForm().fields;

    Object.keys(fields).forEach(name => {
      data[name] = fields[name].value;
    });
    return data;
  }

  getForm() {
    return this.props.forms[this.props.name];
  }

  getErrors() {
    if (this.getForm() && this.getForm().errors) {
      return this.getForm().errors;
    }
    return {};
  }

  onSubmit = e => {
    e && e.preventDefault() && e.stopPropagation();
    let formData = this.getFormData();
    let customValidation;
    if (this.props.onCustomValidation) {
      customValidation = this.props.onCustomValidation(formData);
      // Dispatch customValidation result even if it's ok to rewrite previous error state
      this.props.actions.clientErrors(this.props.name, customValidation);
    } else {
      this.props.actions.clientErrors(this.props.name);
    }

    if (this.props.onCustomValidation && customValidation == true) {
      this.props.onSubmit(this.getFormData());
      this.props.onValidSubmit && this.props.onValidSubmit(formData);
    }
  }

  onReset = e => {
    e && e.preventDefault() && e.stopPropagation();
    this.props.actions.reset(this.props.name);
    this.props.onReset && this.props.onReset();
  }

  // External methods
  submit() {
    this.onSubmit();
  }

  renderError() {
    let errors = this.getErrors();
    if (!errors)
      return;

    if (typeof errors == 'string') {
      return <Alert className="danger">
        <p>Unknown error occurred. Possibly the system is unavailable. Please try again</p>
      </Alert>
    }

    else if (errors && errors.length > 0) {
      return <Alert className="danger">
        {errors.map(error => <p key={error}>{error}</p>)}
      </Alert>
    }
  }

  render() {
    return (
      <div className="form-container">
        {this.getForm() && this.getForm().isLoading && <div className="overlay"></div> }
        <form
          {...this.props}
          onSubmit={this.onSubmit}
          onReset={this.onReset}>
          {this.renderError()}
          {this.props.children}
        </form>
      </div>
    )
  }
}