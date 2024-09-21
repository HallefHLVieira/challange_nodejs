import Styles from './styles.module.css';

function Header()  {
  return (
    <div className={Styles.headerBox}>
      <img src="zeztra-logo.svg" alt="Logo da empresa" />
    </div>
  );
};

export default Header;
