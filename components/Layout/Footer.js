import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
    return (
        <footer>
            Made with 💖 /
            <a
                href="https://jeffreyzhang.me"
                target="_blank"
                rel="noopener noreferrer"
                className="name-link"
            >
                Jeffrey Zhang
            </a>
            <a
                href="https://github.com/jeffreyzhang2001"
                target="_blank"
                rel="noopener noreferrer"
                className="github-icon"
            >
                <FontAwesomeIcon icon={faGithub} color="white" />
            </a>
            <style jsx>{`
                footer {
                    background-color: black;
                    position: fixed;
                    bottom: 0;
                    width: 100%;
                    height: 70px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                footer img {
                    margin-left: 0.5rem;
                }

                footer a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }

                .name-link {
                    padding-left: 5px;
                    text-decoration: none;
                }

                .github-icon {
                    padding: 3px 0 0 8px;
                    font-size: 23px;
                }
            `}</style>
        </footer>
    )
}

export default Footer
