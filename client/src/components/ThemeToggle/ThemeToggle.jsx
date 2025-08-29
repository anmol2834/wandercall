import { IconButton } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  return (
    <IconButton
      onClick={() => dispatch(toggleTheme())}
      className="theme-toggle"
      color="inherit"
    >
      {mode === 'dark' ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
};

export default ThemeToggle;