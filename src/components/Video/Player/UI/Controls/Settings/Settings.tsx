import { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import OutsideClickHandler from 'react-outside-click-handler';

import Btn from '../Btn/Btn';
import { ReactComponent as SettingIcon } from 'assets/icons/gear.svg';
import { ReactComponent as ArrowLeftIcon } from 'assets/icons/arrow-left.svg';
import './Settings.scss';

interface SettingsProps {
  resolutions: shaka.extern.TrackList;
  playbackRates: number[];
  activeResolution: number | 'auto';
  activePlaybackRate: number;
  onChangeResolution: (resolution: shaka.extern.Track | 'auto') => void;
  onChangePlaybackRate: (playbackRate: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  resolutions,
  playbackRates,
  activeResolution,
  activePlaybackRate,
  onChangeResolution,
  onChangePlaybackRate,
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isIndex, setIsIndex] = useState(true);
  const [activeMenu, setActiveMenu] = useState<'resolution' | 'speed'>(
    'resolution'
  );
  const [dropdownHeight, setDropdownHeight] = useState<'initial' | number>(
    'initial'
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdownHandler = useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const closeDropdownHandler = useCallback(() => {
    setIsOpened(false);
  }, []);

  const selectMenuHandler = useCallback(
    (activeMenu: 'resolution' | 'speed') => {
      setIsIndex(false);
      setActiveMenu(activeMenu);
    },
    []
  );

  const selectIndexHandler = useCallback(() => {
    setIsIndex(true);
    setDropdownHeight('initial');
  }, []);

  const calcHeight = useCallback((element) => {
    setDropdownHeight(element.offsetHeight);
  }, []);

  useEffect(() => {
    if (!isOpened) return;

    const dropdown = dropdownRef.current!;
    const dropdownMenu = dropdown.firstChild as HTMLElement;

    setDropdownHeight(dropdownMenu?.offsetHeight || 'initial');
  }, [isOpened]);

  const indexMenu = useMemo(() => {
    return (
      <div className="vp-controls__settings__dropdown__menu">
        <ul className="vp-controls__settings__dropdown__list">
          {resolutions.length > 0 && (
            <li
              className="vp-controls__settings__dropdown__item"
              onClick={() => selectMenuHandler('resolution')}
            >
              <span style={{ fontWeight: 600 }}>Resolution</span>
              <span style={{ marginLeft: 'auto' }}>
                {activeResolution === 'auto'
                  ? `Auto (${
                      resolutions.find((resolution) => resolution.active)
                        ?.height
                    }p)`
                  : activeResolution + 'p'}
              </span>
            </li>
          )}
          <li
            className="vp-controls__settings__dropdown__item"
            onClick={() => selectMenuHandler('speed')}
          >
            <span style={{ fontWeight: 600 }}>Speed</span>
            <span style={{ marginLeft: 'auto' }}>x {activePlaybackRate}</span>
          </li>
        </ul>
      </div>
    );
  }, [resolutions, activeResolution, activePlaybackRate, selectMenuHandler]);

  const menuList = useMemo(() => {
    const changeResolutionHandler = (
      resolution: shaka.extern.Track | 'auto'
    ) => {
      onChangeResolution(resolution);
      setIsIndex(true);
    };

    const changePlaybackRateHandler = (playbackRate: number) => {
      onChangePlaybackRate(playbackRate);
      setIsIndex(true);
    };

    switch (activeMenu) {
      case 'resolution':
        return (
          <div className="vp-controls__settings__dropdown__menu">
            <div
              className="vp-controls__settings__dropdown__label"
              onClick={() => setIsIndex(true)}
            >
              <ArrowLeftIcon />
              <span>Resolutions</span>
            </div>
            <ul className="vp-controls__settings__dropdown__list">
              {resolutions.map((resolution) => (
                <li
                  key={resolution.id}
                  className={`vp-controls__settings__dropdown__item${
                    activeResolution === resolution.height ? ' active' : ''
                  }`}
                  onClick={() => changeResolutionHandler(resolution)}
                >
                  {resolution.height}
                </li>
              ))}
              <li
                className={`vp-controls__settings__dropdown__item${
                  activeResolution === 'auto' ? ' active' : ''
                }`}
                onClick={() => changeResolutionHandler('auto')}
              >
                <span>Auto</span>
                {activeResolution === 'auto' && (
                  <span>
                    (
                    {
                      resolutions.find((resolution) => resolution.active)
                        ?.height
                    }
                    )
                  </span>
                )}
              </li>
            </ul>
          </div>
        );
      case 'speed':
        return (
          <div className="vp-controls__settings__dropdown__menu">
            <div
              className="vp-controls__settings__dropdown__label"
              onClick={() => setIsIndex(true)}
            >
              <ArrowLeftIcon />
              <span>Speed</span>
            </div>
            <ul className="vp-controls__settings__dropdown__list">
              {playbackRates.map((playbackRate) => (
                <li
                  key={playbackRate}
                  className={`vp-controls__settings__dropdown__item${
                    activePlaybackRate === playbackRate ? ' active' : ''
                  }`}
                  onClick={() => changePlaybackRateHandler(playbackRate)}
                >
                  {playbackRate}
                </li>
              ))}
            </ul>
          </div>
        );
    }
  }, [
    activeMenu,
    resolutions,
    playbackRates,
    activeResolution,
    activePlaybackRate,
    onChangeResolution,
    onChangePlaybackRate,
  ]);

  return (
    <div className="vp-controls__settings">
      <OutsideClickHandler onOutsideClick={closeDropdownHandler}>
        <Btn label="Settings" onClick={toggleDropdownHandler}>
          <SettingIcon />
        </Btn>

        <CSSTransition
          in={isOpened}
          classNames="vp-dropdown"
          timeout={200}
          mountOnEnter
          unmountOnExit
          onExited={selectIndexHandler}
        >
          <div
            className="vp-controls__settings__dropdown"
            ref={dropdownRef}
            style={{ height: dropdownHeight }}
          >
            <CSSTransition
              in={isIndex}
              classNames="menu-index"
              timeout={300}
              mountOnEnter
              unmountOnExit
              onEnter={calcHeight}
            >
              {indexMenu}
            </CSSTransition>

            <CSSTransition
              in={!isIndex}
              classNames="menu-main"
              timeout={300}
              mountOnEnter
              unmountOnExit
              onEnter={calcHeight}
            >
              {menuList}
            </CSSTransition>
          </div>
        </CSSTransition>
      </OutsideClickHandler>
    </div>
  );
};

export default memo(Settings);
