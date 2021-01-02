import './css/bootstrap.min.css';
import './css/Header.css';

function Header() {
  return (
    <header className="d-flex flex-column flex-md-row align-items-center p-4 px-md-5 mb-4 bg-white border-bottom shadow-sm">
      <p className="h4 my-0 me-md-auto fw-normal">空間管理系統</p>
      <nav className="my-2 my-md-0 me-md-3">
        <a className="p-2 text-dark navbar-brand" href="#">預約狀況</a>
        <a className="p-2 text-dark navbar-brand" href="#">我的會議</a>
      </nav>
      <a className="mx-2 btn btn-primary" href="#">Sign up</a>
      <a className="mx-2 btn btn-outline-primary" href="#">Log in</a>
    </header>
  );
}

export default Header;
