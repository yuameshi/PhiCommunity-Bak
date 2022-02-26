import './style.css';
import Avatar_svg from 'assets/images/Avatar.svg';

const avatarElem = document.createElement('img');
avatarElem.alt = 'avatar';
avatarElem.src = Avatar_svg;
document.getElementsByClassName('leftArea')[0].prepend(avatarElem);
