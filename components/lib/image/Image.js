import * as React from 'react';
import PrimeReact, { PrimeReactContext, localeOption } from '../api/Api';
import { useHandleStyle } from '../componentbase/ComponentBase';
import { CSSTransition } from '../csstransition/CSSTransition';
import { useUnmountEffect } from '../hooks/Hooks';
import { DownloadIcon } from '../icons/download';
import { EyeIcon } from '../icons/eye';
import { RefreshIcon } from '../icons/refresh';
import { SearchMinusIcon } from '../icons/searchminus';
import { SearchPlusIcon } from '../icons/searchplus';
import { TimesIcon } from '../icons/times';
import { UndoIcon } from '../icons/undo';
import { Portal } from '../portal/Portal';
import { DomHandler, IconUtils, ObjectUtils, ZIndexUtils, classNames, mergeProps } from '../utils/Utils';
import { ImageBase } from './ImageBase';
import { useOnEscapeKey } from '../../lib/hooks/Hooks';

export const Image = React.memo(
    React.forwardRef((inProps, ref) => {
        const context = React.useContext(PrimeReactContext);
        const props = ImageBase.getProps(inProps, context);

        const [maskVisibleState, setMaskVisibleState] = React.useState(false);
        const [previewVisibleState, setPreviewVisibleState] = React.useState(false);
        const [rotateState, setRotateState] = React.useState(0);
        const [scaleState, setScaleState] = React.useState(1);
        const elementRef = React.useRef(null);
        const imageRef = React.useRef(null);
        const maskRef = React.useRef(null);
        const previewRef = React.useRef(null);
        const previewClick = React.useRef(false);

        useOnEscapeKey(maskRef, props.closeOnEscape, () => {
            hide();
        });
        const { ptm, cx, sx, isUnstyled } = ImageBase.setMetaData({
            props,
            state: {
                maskVisible: maskVisibleState,
                previewVisible: previewVisibleState,
                rotate: rotateState,
                scale: scaleState
            }
        });

        useHandleStyle(ImageBase.css.styles, isUnstyled, { name: 'image' });

        const show = () => {
            if (props.preview) {
                setMaskVisibleState(true);
                setTimeout(() => {
                    setPreviewVisibleState(true);
                }, 25);
            }
        };

        const hide = () => {
            if (!previewClick.current) {
                setPreviewVisibleState(false);
                setRotateState(0);
                setScaleState(1);
            }

            previewClick.current = false;
        };

        const onPreviewImageClick = () => {
            previewClick.current = true;
        };

        const onDownload = () => {
            const { alt: name, src } = props;

            DomHandler.saveAs({ name, src });
            previewClick.current = true;
        };

        const rotateRight = () => {
            setRotateState((prevRotate) => prevRotate + 90);
            previewClick.current = true;
        };

        const rotateLeft = () => {
            setRotateState((prevRotate) => prevRotate - 90);
            previewClick.current = true;
        };

        const zoomIn = () => {
            setScaleState((prevScale) => prevScale + 0.1);
            previewClick.current = true;
        };

        const zoomOut = () => {
            setScaleState((prevScale) => prevScale - 0.1);
            previewClick.current = true;
        };

        const onEntering = () => {
            ZIndexUtils.set('modal', maskRef.current, (context && context.autoZIndex) || PrimeReact.autoZIndex, (context && context.zIndex['modal']) || PrimeReact.zIndex['modal']);
        };

        const onEntered = () => {
            props.onShow && props.onShow();
        };

        const onExit = () => {
            DomHandler.addClass(maskRef.current, 'p-component-overlay-leave');
        };

        const onExiting = () => {
            props.onHide && props.onHide();
        };

        const onExited = () => {
            ZIndexUtils.clear(maskRef.current);

            setMaskVisibleState(false);
        };

        useUnmountEffect(() => {
            maskRef.current && ZIndexUtils.clear(maskRef.current);
        });

        const createPreview = () => {
            const buttonProps = mergeProps(
                {
                    className: cx('button'),
                    onClick: show
                },
                ptm('button')
            );

            if (props.preview) {
                return <div {...buttonProps}>{content}</div>;
            }

            return null;
        };

        const createElement = () => {
            const { downloadable, alt, crossOrigin, referrerPolicy, useMap, loading } = props;
            const zoomOutDisabled = scaleState <= 0.5;
            const zoomInDisabled = scaleState >= 1.5;
            const downloadIconProps = mergeProps(ptm('downloadIcon'));
            const rotateRightIconProps = mergeProps(ptm('rotateRightIcon'));
            const rotateLeftIconProps = mergeProps(ptm('rotateLeftIcon'));
            const zoomOutIconProps = mergeProps(ptm('zoomOutIcon'));
            const zoomInIconProps = mergeProps(ptm('zoomInIcon'));
            const closeIconProps = mergeProps(ptm('closeIcon'));
            const downloadIcon = IconUtils.getJSXIcon(props.downloadIcon || <DownloadIcon />, { ...downloadIconProps }, { props });
            const rotateRightIcon = IconUtils.getJSXIcon(props.rotateRightIcon || <RefreshIcon />, { ...rotateRightIconProps }, { props });
            const rotateLeftIcon = IconUtils.getJSXIcon(props.rotateLeftIcon || <UndoIcon />, { ...rotateLeftIconProps }, { props });
            const zoomOutIcon = IconUtils.getJSXIcon(props.zoomOutIcon || <SearchMinusIcon />, { ...zoomOutIconProps }, { props });
            const zoomInIcon = IconUtils.getJSXIcon(props.zoomInIcon || <SearchPlusIcon />, { ...zoomInIconProps }, { props });
            const closeIcon = IconUtils.getJSXIcon(props.closeIcon || <TimesIcon />, { ...closeIconProps }, { props });

            const maskProps = mergeProps(
                {
                    ref: maskRef,
                    className: cx('mask'),
                    onPointerUp: hide
                },
                ptm('mask')
            );

            const toolbarProps = mergeProps(
                {
                    className: cx('toolbar')
                },
                ptm('toolbar')
            );

            const downloadButtonProps = mergeProps(
                {
                    className: cx('downloadButton'),
                    onPointerUp: onDownload,
                    type: 'button'
                },
                ptm('downloadButton')
            );

            const rotateRightButtonProps = mergeProps(
                {
                    className: cx('rotateRightButton'),
                    onPointerUp: rotateRight,
                    type: 'button'
                },
                ptm('rotateRightButton')
            );

            const rotateLeftButtonProps = mergeProps(
                {
                    className: cx('rotateLeftButton'),
                    onPointerUp: rotateLeft,
                    type: 'button'
                },
                ptm('rotateLeftButton')
            );

            const zoomOutButtonProps = mergeProps(
                {
                    className: classNames(cx('zoomOutButton'), { 'p-disabled': zoomOutDisabled }),
                    style: { pointerEvents: 'auto' },
                    onPointerUp: zoomOut,
                    type: 'button',
                    disabled: zoomOutDisabled
                },
                ptm('zoomOutButton')
            );

            const zoomInButtonProps = mergeProps(
                {
                    className: classNames(cx('zoomInButton'), { 'p-disabled': zoomInDisabled }),
                    style: { pointerEvents: 'auto' },
                    onPointerUp: zoomIn,
                    type: 'button',
                    disabled: zoomInDisabled
                },
                ptm('zoomInButton')
            );

            const closeButtonProps = mergeProps(
                {
                    className: cx('closeButton'),
                    type: 'button',
                    'aria-label': localeOption('close')
                },
                ptm('closeButton')
            );

            const previewProps = mergeProps(
                {
                    src: props.zoomSrc || props.src,
                    className: cx('preview'),
                    style: sx('preview', { rotateState, scaleState }),
                    onPointerUp: onPreviewImageClick,
                    crossOrigin: crossOrigin,
                    referrerPolicy: referrerPolicy,
                    useMap: useMap,
                    loading: loading
                },
                ptm('preview')
            );
            const previewContainerProps = mergeProps(
                {
                    ref: previewRef
                },
                ptm('previewContainer')
            );

            const transitionProps = mergeProps(
                {
                    classNames: cx('transition'),
                    in: previewVisibleState,
                    timeout: { enter: 150, exit: 150 },
                    unmountOnExit: true,
                    onEntering: onEntering,
                    onEntered: onEntered,
                    onExit: onExit,
                    onExiting: onExiting,
                    onExited: onExited
                },
                ptm('transition')
            );

            return (
                <div {...maskProps}>
                    <div {...toolbarProps}>
                        {downloadable && <button {...downloadButtonProps}>{downloadIcon}</button>}
                        <button {...rotateRightButtonProps}>{rotateRightIcon}</button>
                        <button {...rotateLeftButtonProps}>{rotateLeftIcon}</button>
                        <button {...zoomOutButtonProps}>{zoomOutIcon}</button>
                        <button {...zoomInButtonProps}>{zoomInIcon}</button>
                        <button {...closeButtonProps}>{closeIcon}</button>
                    </div>
                    <CSSTransition nodeRef={previewRef} {...transitionProps}>
                        <div {...previewContainerProps}>
                            <img alt={alt} {...previewProps} />
                        </div>
                    </CSSTransition>
                </div>
            );
        };

        React.useImperativeHandle(ref, () => ({
            props,
            show,
            hide,
            getElement: () => elementRef.current,
            getImage: () => imageRef.current
        }));

        const { src, alt, width, height, crossOrigin, referrerPolicy, useMap, loading } = props;
        const element = createElement();
        const iconProp = mergeProps(
            {
                className: cx('icon')
            },
            ptm('icon')
        );
        const icon = props.indicatorIcon || <EyeIcon {...iconProp} />;
        const indicatorIcon = IconUtils.getJSXIcon(icon, { ...iconProp }, { props });
        const content = props.template ? ObjectUtils.getJSXElement(props.template, props) : indicatorIcon;
        const preview = createPreview();
        const imageProp = mergeProps(
            {
                ref: imageRef,
                src: src,
                className: props.imageClassName,
                width: width,
                height: height,
                crossOrigin: crossOrigin,
                referrerPolicy: referrerPolicy,
                useMap: useMap,
                loading: loading,
                style: props.imageStyle,
                onError: props.onError
            },
            ptm('image')
        );
        const image = props.src && <img {...imageProp} alt={alt} />;

        const rootProps = mergeProps(
            {
                ref: elementRef,
                className: cx('root')
            },
            ImageBase.getOtherProps(props),
            ptm('root')
        );

        return (
            <span {...rootProps}>
                {image}
                {preview}
                {maskVisibleState && <Portal element={element} appendTo={document.body} />}
            </span>
        );
    })
);

Image.displayName = 'Image';
