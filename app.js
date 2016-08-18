import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as NavActions from 'helpers/history/actionCreators'
import * as SearchActions from 'actions/search.customers'
import TextBox from 'components/controls/TextBox'
import ValidationForm from 'components/controls/validation/form'
import { registry } from 'routes'
import { Default } from 'constants/index'

@connect(state => ({
  search: state.search.customers
}), dispatch => ({
  actions: bindActionCreators(SearchActions, dispatch),
  nav: bindActionCreators(NavActions, dispatch),
}))
export default class SearchParams extends React.Component {

  constructor() {
    super();
    this.state = {
      params: {
        customerId: null,
        firstName: null,
        lastName: null,
        phone: null
      }
    }
  }

  componentWillMount() {
    let {auto_open, ...queryParams} = this.props.location.query;
    if (Object.keys(queryParams).length > 0) {
      this.setState({params: queryParams})
    }
  }

  componentWillReceiveProps(nextProps) {
    let {search} = nextProps;
    if (this.props.location.query.hasOwnProperty('auto_open') && search && search.result) {
      let provider = search.result.list[0];
      if (provider) {
        this.props.nav.push(registry.provider(provider.customerId).index);
      }
    }
  }

  onFormInitialized = () => {
    if (Object.keys(this.props.location.query).length > 0) {
      this.refs.form.getWrappedInstance().submit();
    }
  }

  onCustomValidation(formData) {
    let hasAnyValue = Object.keys(formData).findIndex(key => formData[key] != undefined && formData[key] != '' && formData[key] != null)
    if (hasAnyValue == -1) {
      return {
        general: ['At least one field is required']
      };
    }
    return true;
  }

  onValidSubmit = (formData) => {
    if (this.props.location.query.hasOwnProperty('auto_open'))
      formData.auto_open = true;
    this.props.nav.replace({
      pathname: 'SOME URL',
      query: formData
    });
  }

  onSubmit = (formData) => {
    this.props.actions.execute('search.customers', this.getSearchParams(formData));
  }

  getSearchParams(formData) {
    return {
      offset: Default.search.Offset,
      limit: Default.search.Limit,
      ...formData
    }
  }

  render() {
    let p = this.state.params;
    return (
      <ValidationForm
        ref="form"
        name="search.customers"
        onInitialized={ this.onFormInitialized }
        onSubmit={ this.onSubmit }
        onValidSubmit={ this.onValidSubmit }
        onCustomValidation={ this.onCustomValidation }
        onReset={ SearchActions.reset }>
        <div className="search-params">
          <TextBox name="customerId" value={p.customerId} placeholder="Customer Id"/>
          <TextBox name="firstName" value={p.firstName} placeholder="First name"/>
          <TextBox name="lastName" value={p.lastName} placeholder="Last name"/>
          <TextBox name="phone" value={p.phone} placeholder="Phone No."/>
          <button type="submit" className="button small">Search</button>
          <button type="reset" className="button secondary small">Reset</button>
        </div>
      </ValidationForm>
    );
  }
}