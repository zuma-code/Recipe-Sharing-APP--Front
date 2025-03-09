// src/components/Layout.jsx
function Layout({ children }) {
    return (
      <div data-theme="bumblebee" className="min-h-screen">
        {children}
      </div>
    );
  }
  
  export default Layout;