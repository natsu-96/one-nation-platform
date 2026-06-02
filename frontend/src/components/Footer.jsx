import './Footer.css'

const footerData = [
    {
    title: "Platform",
    links: [
    "Talent Zone",
    "Naija Votes",
    "Weekly Quiz"
        ]
    },
    {
        title: "Company",
        links: [
            "About Us",
            "Contact",
            "Privacy Policy"
        ]
    },
    {
        title: "Follow Us",
        links: [
            "X (Twitter)",
            "Instagram",
            "TikTok"
        ]
    }
]

function Footer() {
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-top">
                    <div className="footer-logo">
                        <h2>Nigeria Celebrates</h2>
                        <p>Celebrating Nigerian talent, culture, and achievement on a global stage.</p>
                    </div>
                    <div className="footer-columns">
                         {footerData.map((coulmn, colIndex) => (
                             <div className="footer-column" key={colIndex}>
                                 <h4 className='footer-header'>{coulmn.title}</h4>
                                 <ul className='footer-links'>
                                     {coulmn.links.map((link, linkIndex) => (
                                         <li key={linkIndex}>
                                             <a href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} className='footer-link'>
                                             {link}
                                             </a>
                                         </li>
                                     ))}
                                 </ul>
                            </div>
                       ))}
                     </div>
                </div>
                <div className="footer-bottom">
                    <hr />
                    <div className="bottom-content">
                        <span className='copyright'>© 2026 Nigeria Celebrates. All rights reserved. One Nation. One Voice. One Celebration.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer