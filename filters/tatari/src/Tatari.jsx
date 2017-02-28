import React, { PropTypes } from 'react';
import qs from 'qs';
import { get, patch } from './TatariApi';
import TatariDropdownPlain from './TatariDropdownPlain';
import TatariDropdownCheckboxes from './TatariDropdownCheckboxes';

import baseStyles from './Tatari.scss';
import defaultStyles from './TatariDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tatari extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    stylesheets: PropTypes.arrayOf(PropTypes.shape()),
    urls: PropTypes.shape({
      saved: PropTypes.string,
      available: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
    stylesheets: [defaultStyles]
  }

  constructor(props) {
    super(props);

    styles = composeStyles(baseStyles, props.stylesheets);

    this.state = {
      activeFilters: [],
      expanded: {},
      inactiveFilters: [],
      loading: { inactive: true },
      // TODO preserve inactive stable ordering
      options: {}
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.onBlur);

    get(this.props.urls.available)
      .then(({ data }) => {
        this.setState({ inactiveFilters: data });

        // Populate filters from URL first, then try remote retrieve.
        const url = window.location.href.split('?');
        const params = qs.parse(url[1]);
        if (params.filters) {
          // TODO is this correct
          return { data: params.filters };
        }

        return get(this.props.urls.saved);
      })
      .then(({ data }) => {
        // SAMPLE: {ball_in_court_id: ["1228193", "1188710"]}
        const keys = Object.keys(data);

        // if (keys.length === 0) {
        //
        // }

        // this.setState({ activeFilters: data });

        //     const filterData = availableFiltersSelector(getState()).reduce(
        //       (acc, v) => Object.assign(acc, { [v.key]: v }), {});
        //
        //     Object.keys(params.filters).forEach(async (key) => {

                //  await dispatch(activeAdd(filterData[key]));

        //
        //       params.filters[key].forEach((v) => {
        //           toggleCheckbox(
        //             { itemKey: v, evt: { target: { value: key, checked: true }}},
        //           ),
        //         );
        //
        //       delete params.filters[key];
        //
        //       if (Object.keys(params.filters).length === 0) {
        //         dispatch(initResolve);
        //       }
      })
      .catch(e => { console.error(e); }) // eslint-disable-line
      .then(() => { this.setState({ loading: {} }); });
  }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;
    if (this.state.loading[key]) {
      return;
    }

    // TODO this.props.activeRemoveEmpty();

    const expanded = { [key]: !this.state.expanded[key] };

    this.setState({ expanded });
  }

  onBlur = () => {
    this.setState({ expanded: {} });

    // const openFilters = isOpen
    //   .reduce((acc, v) => { return (v ? acc + 1 : acc); }, 0);
    //
    // if (openFilters > 0) {
    //   activeRemoveEmpty();
    //   activeSetAllClosed();
    //   storedPatch(persistenceUrl);
    //   onComplete();
    // }
  }

  onSearch = (evt) => {
    // TODO throttle

    const value = evt.target.value.toLowerCase();
    const key = evt.target.dataset.key;

    const options = this.state.options;

    const filteredOptions = options[key].map(option => Object.assign(option,
      { hidden: (option.value.toLowerCase().indexOf(value) === -1) }));

    options[key] = filteredOptions;

    this.setState({ options });
  }

  checkOne = (evt) => {
    evt.stopPropagation();

    const { options } = this.state;
    const key = evt.target.dataset.key;
    const filterKey = evt.target.dataset.filterKey;

    options[filterKey].forEach((option) => {
      if (option.key.toString() === key) {
        option.checked = !option.checked;
      }
    });

    this.setState({ options, expanded: Object.assign(this.state.expanded, { [filterKey]: true }) });
  }

  checkAll = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const { options } = this.state;

    options[key].reduce((acc, option) =>
      acc.concat(Object.assign(option, { checked: true })), []);

    // Not sure why this works _without_ resetting the state? Ben 170228
    this.setState({ options });
  }

  checkNone = (evt) => {
    evt.stopPropagation();

    const key = evt.target.dataset.key;
    const options = this.state.options;

    options[key].reduce((acc, option) =>
      Object.assign(option, { checked: false }), []);

    // See above.
    this.setState({ options });
  }

  addActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters, loading, options } = this.state;

    const key = evt.target.dataset.key;
    const index = inactiveFilters.findIndex(filter => filter.key === key);
    const item = inactiveFilters[index];

    inactiveFilters.splice(index, 1);
    activeFilters.push(item);

    if (options[key] === undefined) {
      loading[key] = true;
      get(item.endpoint).then(({ data }) => {
        options[key] = data;
        const newLoading = this.state.loading;
        newLoading[key] = false;
        this.setState({ loading: newLoading });
      });
    }

    this.setState({ inactiveFilters, activeFilters, loading, expanded: {} });
  }

  removeActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters } = this.state;

    const key = evt.target.dataset.key;
    const index = activeFilters.findIndex(filter => filter.key === key);
    const item = activeFilters[index];

    activeFilters.splice(index, 1);
    inactiveFilters.push(item);
    this.setState({ inactiveFilters, activeFilters });
  }

  removeAllActive = () => {
    // TODO URL update
    const { activeFilters, inactiveFilters } = this.state;
    const inactive = inactiveFilters.concat(activeFilters);

    this.setState({ inactiveFilters: inactive, activeFilters: [] });
  }

  render() {
    const inactiveFilters = this.state.inactiveFilters.length
      ? (<TatariDropdownPlain
        data={this.state.inactiveFilters}
        isExpanded={this.state.expanded.inactive}
        isLoading={this.state.loading.inactive}
        onChange={this.addActive}
        onExpand={this.onExpand}
        styles={styles}
      />)
      : null;

    const activeFilters = this.state.activeFilters
      .map(item => <TatariDropdownCheckboxes
        key={`active-${item.key}`}
        filter={item}
        isExpanded={this.state.expanded[item.key]}
        isLoading={this.state.loading[item.key]}
        onChange={() => {}}
        onCheckOne={this.checkOne}
        onCheckAll={this.checkAll}
        onCheckNone={this.checkNone}
        onExpand={this.onExpand}
        onRemove={this.removeActive}
        onSearch={this.onSearch}
        options={this.state.options[item.key]}
        styles={styles}
      />);

    const clearAll = (activeFilters.length
      ? (<div
        onClick={this.removeAllActive}
        className={styles.clearAllFilters}
      >
        Clear All
      </div>)
      : null);

    return (
      <div className={styles.filterContainer}>
        {activeFilters}
        {inactiveFilters}
        {clearAll}
      </div>
    );
  }
}
