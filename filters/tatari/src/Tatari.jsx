import React, { PropTypes } from 'react';
import qs from 'qs';
// import cx from 'classnames';
// import { getSaved, getAvailable, init } from './TatariUtils';
import { get, patch } from './TatariApi';

// import baseStyles from './Tatari.scss';
// import defaultStyles from './TatariDefault.scss';
// import composeStyles from '../../../shared/stylesheetComposer';
//
// import TatariCheckboxItem from './TatariCheckboxItem';
// import TatariPlainItem from './TatariPlainItem';
// import TatariClearAll from './TatariClearAll';
// import TatariFilterHead from './TatariFilterHead';

// let styles = {};


export default class Tatari extends React.Component {
  static propTypes = {
    // activeAdd: PropTypes.func,
    // activeFilters: PropTypes.shape(),
    // activeFiltersCheckedCount: PropTypes.shape(),
    // activeRemoveAll: PropTypes.func,
    // activeRemoveEmpty: PropTypes.func,
    // activeRemoveOne: PropTypes.func,
    // activeSetAllClosed: PropTypes.func,
    // activeSetOpen: PropTypes.func,
    // availableFilters: PropTypes.arrayOf(PropTypes.shape()),
    // getAvailable: PropTypes.func,
    // callback: PropTypes.func,
    // checkAllCheckboxes: PropTypes.func,
    // hydrateUrl: PropTypes.func,
    // init: PropTypes.func,
    // isOpen: PropTypes.shape(),
    // onChange: PropTypes.func,
    // storedPatch: PropTypes.func,
    // toggleCheckbox: PropTypes.func,
    // uncheckAllCheckboxes: PropTypes.func,
    // updateUrl: PropTypes.func,

    onFetch: PropTypes.func.isRequired,
    urls: PropTypes.shape({
      saved: PropTypes.string,
      available: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);

    this.state = {
      activeFilters: [],
      availableFilters: [],
      loading: { init: true }
    };
  }

  componentDidMount() {
    // window.addEventListener('click', this.blurHandler);

    get(this.props.urls.available)
      .then(({ data }) => {
        this.setState({ availableFilters: data });

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

  onAvailableClick = (evt) => {
    // evt.stopPropagation();
  }

  onClearAllClick = () => {
    // this.props.activeRemoveAll();
    // this.props.updateUrl();
    // this.props.onChange();
  }

  onAvailableChange = (item) => {
    // this.props.activeAdd(item);
    // this.props.activeSetOpen({ key: item.key });
  }

  onAvailableToggle = (isExpanded) => {
    // if (isExpanded) {
    //   this.props.activeSetAllClosed();
    //   this.props.activeRemoveEmpty();
    // }
  }

  expandActiveFilter = key => (evt) => {
    // evt.stopPropagation();
    //
    // if (this.props.isOpen.get(key) !== true) {
    //   this.props.activeSetOpen({ key });
    // }
  }

  blurHandler = () => {
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

  itemRenderer = (key) => {
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
  }

  headRenderer = (key) => {
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
  }

  render() {
    // const {
    //   activeFilters,
    //   availableFilters,
    //   isOpen,
    // } = this.props;
    //
    // const bank = activeFilters.toJS();
    // const bankKeys = Object.keys(bank);
    //
    // const availableFiltersWithoutActive = availableFilters
    //   .filter(obj => bankKeys.indexOf(obj.key) === -1);
    //
    const availableFiltersIfAny = <div>tmp</div>
    // const availableFiltersIfAny = availableFiltersWithoutActive.length
    //   ? (<div className={styles.dropdown} onClick={this.onAvailableClick}>
    //     <DropdownList
    //       data={availableFiltersWithoutActive}
    //       itemComponent={TatariPlainItem}
    //       onToggle={this.onAvailableToggle}
    //       onChange={this.onAvailableChange}
    //       value="Add Filter"
    //       textField="text"
    //       valueField="endpoint"
    //     />
    //   </div>)
    //   : null;
    //
    // const currentFilters = Object.keys(bank).map((key) => {
    //   return (
    //     <div
    //       key={key}
    //       className={styles.dropdown}
    //       onClick={this.expandActiveFilter(key)}
    //       ref={div => (this[key] = div)}
    //     >
    //       <DropdownList
    //         data={bank[key]}
    //         filter="contains"
    //         valueComponent={this.headRenderer(key)}
    //         itemComponent={this.itemRenderer(key)}
    //         onToggle={this.onAvailableToggle}
    //         open={isOpen.get(key)}
    //         textField="value"
    //         valueField="key"
    //       />
    //     </div>
    //   );
    // });
    //
    // const clearAll = currentFilters.length
    //   ? <TatariClearAll onClick={this.onClearAllClick} />
    //   : null;
    //
    // {currentFilters}
    // {clearAll}

    return (
      <div>
        {availableFiltersIfAny}
      </div>
    );
  }
}
