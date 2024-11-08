export const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: '4px 6px', 
    width: '400px',
    borderRadius: '10px',
    border: '1px solid #787878cc',
    backgroundColor: '#dbdbdb',
    fontSize: '20px',
    boxShadow: 'none', 
    '&:hover': {
      border: '1px solid #787878cc',
    },
  }),
  menu: (provided) => ({
    ...provided,
    width: '400px',
    borderRadius: '10px',
    backgroundColor: '#dbdbdb',
    zIndex: 9999, 
  }),
  option: (provided, state) => ({
    ...provided,
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
    fontSize: '16px',
  }),
};
