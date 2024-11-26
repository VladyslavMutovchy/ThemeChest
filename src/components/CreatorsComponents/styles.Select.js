export const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: '4px 6px',
    minWidth: '250px',
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #787878cc',
    backgroundColor: '#dbdbdb',
    fontSize: '20px',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': {
      border: '1px solid #787878cc',
    },
  }),
  menu: (provided) => ({
    ...provided,
    minWidth: '250px',
    width: '100%',
    borderRadius: '10px',
    backgroundColor: '#dbdbdb',
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    backgroundColor: state.isFocused ? '#c4c4c4' : '#dbdbdb',
    color: '#000',
    padding: '8px 10px',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '16px',
  }),
  singleValue: (provided) => ({
    ...provided,
    display: 'none',
  }),
};
