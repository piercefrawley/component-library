import React, { PropTypes } from 'react';
import qs from 'qs';
// import cx from 'classnames';
// import { getSaved, getAvailable, init } from './TatariUtils';
import { get, patch } from './TatariApi';
import TatariDropdownPlain from './TatariDropdownPlain';
import TatariDropdownCheckboxes from './TatariDropdownCheckboxes';

import baseStyles from './Tatari.scss';
import defaultStyles from './TatariDefault.scss';
import composeStyles from '../../../shared/stylesheetComposer';

let styles = {};

export default class Tatari extends React.Component {
  static propTypes = {
    onFetch: PropTypes.func.isRequired,
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
      loading: { inactive: true }
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
        this.setState({ loading: {} });
      })
      // .then(init)
      // .then(() => {
        // this.props.onFetch(SEND FILTER DATA HERE);
      // })
      .catch(e => { console.error(e); }) // eslint-disable-line
      .then(() => {
        const loading = Object.assign(this.state.loading, { init: false });
        this.setState({ loading });
      });
  }

  // onClearAllClick = () => {
    // this.props.activeRemoveAll();
    // this.props.updateUrl();
    // this.props.onChange();
  // }

  // onAvailableToggle = (isExpanded) => {
    // if (isExpanded) {
    //   this.props.activeSetAllClosed();
    //   this.props.activeRemoveEmpty();
    // }
  // }

  onExpand = (evt) => {
    evt.stopPropagation();
    const key = evt.currentTarget.dataset.key;
    if (this.state.loading[key]) {
      return;
    }

    const expanded = { [key]: !this.state.expanded[key] };

    this.setState({ expanded });
  }

  onBlur = () => {
    this.setState({ expanded: {} });

    // const {
    //   activeRemoveEmpty,
    //   activeSetAllClosed,
    //   isOpen,
    //   onChange,
    //   storedPatch,
    //   persistenceUrl,
    // } = this.props;
    //
    // const openFilters = isOpen
    //   .reduce((acc, v) => { return (v ? acc + 1 : acc); }, 0);
    //
    // if (openFilters > 0) {
    //   activeRemoveEmpty();
    //   activeSetAllClosed();
    //   storedPatch(persistenceUrl);
    //   onChange();
    // }
  }

  // itemRenderer = (key) => {
    // const {
    //   checkAllCheckboxes,
    //   toggleCheckbox,
    //   uncheckAllCheckboxes,
    //   updateUrl,
    // } = this.props;
    //
    // return TatariCheckboxItem.bind(null, {
    //   checkAllCheckboxes,
    //   key,
    //   toggleCheckbox,
    //   uncheckAllCheckboxes,
    //   updateUrl,
    // });
  // }

  // headRenderer = (key) => {
    // const {
    //   availableFilters,
    //   activeFiltersCheckedCount,
    //   activeRemoveOne,
    //   onChange,
    //   updateUrl,
    // } = this.props;
    //
    // const currentFilter = availableFilters.find(obj => obj.key === key);
    //
    // const onRemove = () => {
    //   activeRemoveOne(currentFilter.key);
    //   updateUrl();
    //   onChange();
    // };
    //
    // return TatariFilterHead.bind(null,
    //   onRemove,
    //   currentFilter.text,
    //   activeFiltersCheckedCount.get(key),
    // );
  // }

  addActive = (evt) => {
    evt.stopPropagation();

    const { activeFilters, inactiveFilters } = this.state;

    const key = evt.target.dataset.key;
    const index = inactiveFilters.findIndex(filter => filter.key === key);
    const item = inactiveFilters[index];

    inactiveFilters.splice(index, 1);
    activeFilters.push(item);
    this.setState({ inactiveFilters, activeFilters, expanded: {} });
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
        onExpand={this.onExpand}
        onRemove={this.removeActive}
        data={[]}
        styles={styles}
      />);

      // TODO count if more than 1 filter selected
      // const clearAll = activeFilters.length
      //   ? <TatariClearAll onClick={this.onClearAllClick} />
      //   : null;
      //
      // {currentFilters}
      // {clearAll}

      const clearAll = (activeFilters.length
        ? (<div
          onClick={this.removeAllActive}
          className={styles.clearAllFilters}
        >
          Clear All
        </div>)
        : null)

    return (
      <div>
        {activeFilters}
        {inactiveFilters}
        {clearAll}
      </div>
    );
  }
}
