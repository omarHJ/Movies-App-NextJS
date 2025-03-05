export const Footer: React.FC = () => {
    const getCurrentYear = () => {
      return new Date().getFullYear();
    };
  
    return (
      <footer className="bg-dark text-white py-0 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="text-white mb-0">
                &copy; {getCurrentYear()} Movies App. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
                <a href="/privacy" className="text-white me-3 text-decoration-none">Privacy Policy</a>
                <a href="/terms" className="text-white text-decoration-none">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    );
  };