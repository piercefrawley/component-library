import React, { PropTypes } from 'react';
import styles from './Tatari.scss';

const TatariCheckboxItem = ({
  checkAllCheckboxes,
  key,
  toggleCheckbox,
  uncheckAllCheckboxes,
  updateUrl
}, { item }) => {
  const onChange = (evt) => {
    toggleCheckbox({ itemKey: item.key, evt });
    updateUrl();
  };

  const onCheckAll = () => {
    checkAllCheckboxes(key);
    updateUrl();
  };

  const onUncheckAll = () => {
    uncheckAllCheckboxes(key);
    updateUrl();
  };

  if (item === 'SELECTALL') {
    return (
      <div className={styles['toggle-items-container']}>
        <button onClick={onCheckAll} className={styles['select-all-items']}>
          Select All
        </button>
        <span className={styles['toggle-items-divider']}>/</span>
        <button onClick={onUncheckAll} className={styles['clear-all-items']}>
          Clear All
        </button>
      </div>
    );
  }

  const id = `tatari-checkbox-item-${item.key}`;

  const checked = (item.checked ? 'checked' : null);

  return (
    <label htmlFor={id} className={styles['checkbox-item']}>
      <input type='checkbox' {...{id, value: key, onChange, checked }} />
      {item.value}
    </label>
  );
};

TatariCheckboxItem.propTypes = {
  checkAllCheckboxes: PropTypes.func,
  item: PropTypes.shape({
    // key: React.PropTypes.string,
    // value: React.PropTypes.string,
  }),
  key: PropTypes.string,
  toggleCheckbox: PropTypes.func,
  uncheckAllCheckboxes: PropTypes.func,
  updateUrl: PropTypes.func,
};

export default TatariCheckboxItem;
