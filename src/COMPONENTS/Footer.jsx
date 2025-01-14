import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

function Footer({ theme }) {
  const footerBgColor = theme === 'light' ? 'light' : 'dark';
  const footerTextColor = theme === 'light' ? 'text-muted' : 'text-white';

  return (
    <div>
      <MDBFooter 
        bgColor={footerBgColor} 
        className={`text-center text-lg-start ${footerTextColor}`} 
        style={theme === 'dark' ? { color: '#fff' } : { color: 'rgb(218, 31, 31)' }} // Set the color for text here
      >
        <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
          <div className='me-5 d-none d-lg-block'>
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a href='' className='me-4'>
              <MDBIcon fab icon="facebook-f" />
            </a>
            <a href='' className='me-4'>
              <MDBIcon fab icon="twitter" />
            </a>
            <a href='' className='me-4'>
              <MDBIcon fab icon="google" />
            </a>
            <a href='' className='me-4'>
              <MDBIcon fab icon="instagram" />
            </a>
            <a href='' className='me-4'>
              <MDBIcon fab icon="linkedin" />
            </a>
            <a href='' className='me-4'>
              <MDBIcon fab icon="github" />
            </a>
          </div>
        </section>

        <section className=''>
          <MDBContainer className='text-center text-md-start mt-5'>
            <MDBRow className='mt-3'>
              <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>
                  <MDBIcon icon="gem" className="me-3" />
                  Recipe Book
                </h6>
                <p>
                  Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.
                </p>
              </MDBCol>

              <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Angular</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>React</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Vue</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Laravel</a>
                </p>
              </MDBCol>

              <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Pricing</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Settings</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Orders</a>
                </p>
                <p>
                  <a href='#!' style={{ color: 'inherit' }}>Help</a>
                </p>
              </MDBCol>

              <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                <p>
                  <MDBIcon icon="home" className="me-2" />
                  New York, NY 10012, US
                </p>
                <p>
                  <MDBIcon icon="envelope" className="me-3" />
                  info@example.com
                </p>
                <p>
                  <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
                </p>
                <p>
                  <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>

        <div className='text-center p-4' style={{ backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : '#333' }}>
          <span>
            © 2024 Copyright:
            <a className='fw-bold' href='https://mdbootstrap.com/' style={{ color: 'inherit' }}>
              Recipe Home.com
            </a>
          </span>
        </div>
      </MDBFooter>
    </div>
  );
}

export default Footer;
