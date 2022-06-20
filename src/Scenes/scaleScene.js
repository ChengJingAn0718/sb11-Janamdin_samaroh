import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { getAudioPath, prePathUrl, setExtraVolume } from "../components/CommonFunctions";
import { MaskComponent } from "../components/CommonComponents"


const maskPathList = [
    ['1'],
    ['grey_bg'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['sub'],
    ['8'],
    ['9'],
    ['10'],
    ['11'],
    ['12'],
    ['sub'],
    ['14'],
]


const maskTransformList = [
    { x: 0.5, y: 0.5, s: 2 },
    { x: 0.1, y: 0.0, s: 1.2 },
    { x: 0.5, y: 0.5, s: 2 },
    { x: 0.0, y: 0.2, s: 1.4 },
    { x: 0.5, y: 0.4, s: 2.2 },
    { x: -0.25, y: -0.3, s: 1.6 },
    { x: -0.4, y: 0.35, s: 1.8 },
    { x: 0.3, y: 0.1, s: 1.6 },
    { x: -0.3, y: 0.2, s: 1.8 },
    { x: -0.6, y: 0.4, s: 2.2 },
    { x: 0.2, y: -0.35, s: 1.8 },
    { x: 0.1, y: 0.0, s: 1.3 },
    { x: 0.6, y: -0.6, s: 2.2 },
    { x: 0.4, y: -0.1, s: 1.8 },
]

let currentMaskNum = 0;
let subMaskNum = 0;

// plus values..
const marginPosList = [
    { s: 2, l: 0.5, t: 0.5 },
    { s: 4, l: 0.0, t: 0 },
    { s: 2, l: 0.5, t: 0.5 },
    { s: 2, l: -0.2, t: 0.6 },
    { s: 2, l: 0.5, t: 0.4 },
    { s: 2, l: -0.3, t: -0.3 },
    { s: 2, l: 0.5, t: 0.5 },
    { s: 2, l: 0.3, t: 0.3 },
    { s: 2, l: -0.4, t: 0.3 },
    { s: 2, l: -0.7, t: 0.3 },
    { s: 2, l: 0.4, t: -0.3 },
    { s: 1, l: -0.1, t: 0.15 },
    { s: 2, l: 0.6, t: -0.5 },
    { s: 2, l: 0.5, t: -0.4 },
]

const audioPathList = [
    ['1'],
    ['2'],
    ['3'],
    ['4'],
    ['5'],
    ['6'],
    ['7', '8'],
    ['9'],
    ['10'],
    ['11'],
    ['12'],
    ['13'],
    ['14', '15', '16'],
    ['17'],
]

const subMarkInfoList = [
    [
        { p: '6', t: 1500, ps: 1, pl: -0.4, pt: 0.3 },
        { p: '7', t: 6500, ps: 1, pl: -0.4, pt: 0.4 },
    ],

    [
        { p: '13', t: 8000, ps: 1, pl: 0.3, pt: -0.3 },
        { p: '15', t: 12500, ps: 1, pl: 0.3, pt: -0.2 },
        { p: '16', t: 13500, ps: 1, pl: 0.3, pt: -0.2 },
        { p: '17', t: 15000, ps: 1, pl: 0.25, pt: -0.15 },
        { p: '18', t: 16300, ps: 1, pl: 0.25, pt: -0.15 },
    ],
]


const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, bgLoaded }, ref) => {

    const audioList = useContext(UserContext)

    const bodyAudioList = [audioList.bodyAudio1, audioList.bodyAudio2, audioList.bodyAudio3]

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()
    const subMaskRefList = Array.from({ length: 5 }, ref => useRef())


    const wordTextList = Array.from({ length: 5 }, ref => useRef())

    const [isSubMaskLoaded, setSubMaskLoaded] = useState(false)
    const [isSceneLoad, setSceneLoad] = useState(false)

    useEffect(() => {

        return () => {
            currentMaskNum = 0;
            subMaskNum = 0
        }

    }, [])


    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {

            loadFunc()

            setExtraVolume(audioList.bodyAudio1, 2)
            setExtraVolume(audioList.bodyAudio2, 2)
            setExtraVolume(audioList.bodyAudio3, 2)
            setExtraVolume(audioList.bodyAudio0, 2)

            baseObject.current.className = 'aniObject'
            audioList.bodyAudio1.src = getAudioPath('intro/' + audioPathList[currentMaskNum][0]);

            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                returnImgPath(maskPathList[currentMaskNum][0], true) + '")'

            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'

            setTimeout(() => {
                setSubMaskLoaded(true)
                showIndividualImage()
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            subMaskNum = 0;

            setSceneLoad(false)
        }
    }))

    function returnImgPath(imgName, isAbs = false) {
        return isAbs ? (prePathUrl() + 'images/intro/' + imgName + '.png')
            : ('intro/' + imgName + '.png');
    }

    const durationList = [
        2, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1, 1.4, 1.4, 1.4, 1.5, 1.5
    ]
    function showIndividualImage() {
        blackWhiteObject.current.className = 'hideObject'
        let currentMaskName = maskPathList[currentMaskNum]

        baseObject.current.style.transition = durationList[currentMaskNum] + 's'

        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,'
            + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            let timeDuration = 4000

            if (currentMaskNum != maskPathList.length - 1)
                audioPathList[currentMaskNum].map((value, index) => {
                    timeDuration += bodyAudioList[index].duration * 1000 + 500
                }
                )
            else
                timeDuration = 4000

            if (currentMaskName != 'sub') {
                blackWhiteObject.current.className = 'show'
                colorObject.current.className = 'hide'
            }
            else {
                subMarkInfoList[subMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index == 0)
                            colorObject.current.className = 'hide'

                        subMaskRefList[index].current.setClass('appear')
                        if (index > 0)
                            subMaskRefList[index - 1].current.setClass('hide')
                        if (value.ps != null) {
                            subMaskRefList[index].current.setStyle({
                                transform:
                                    "translate(" + _baseGeo.width * value.pl / 100 + "px,"
                                    + _baseGeo.height * value.pt / 100 + "px)"
                                    + "scale(" + (1 + value.ps / 100) + ") "
                            })

                        }
                    }, value.t);
                })
            }

            if (maskPathList[currentMaskNum].length > 1) {
                maskPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        if (index > 0) {
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                returnImgPath(maskPathList[currentMaskNum][index], true) + '")'
                        }

                    }, (audioList.bodyAudio1.duration * 1000 + 1000) / maskPathList[currentMaskNum].length * index);
                }
                )
            }

            setTimeout(() => {

                if (marginPosList[currentMaskNum].s != null) {
                    currentImage.current.style.transform =
                        "translate(" + _baseGeo.width * marginPosList[currentMaskNum].l / 100 + "px,"
                        + _baseGeo.height * marginPosList[currentMaskNum].t / 100 + "px)"
                        + "scale(" + (1 + marginPosList[currentMaskNum].s / 100) + ") "
                }


                let time = 0

                audioPathList[currentMaskNum].map((value, index) => {
                    setTimeout(() => {
                        bodyAudioList[index].play()
                    }, time);
                    time += bodyAudioList[index].duration * 1000 + 500
                })

                setTimeout(() => {
                    if (currentMaskNum < audioPathList.length - 1) {
                        audioPathList[currentMaskNum + 1].map((value, index) => {
                            bodyAudioList[index].src = getAudioPath('intro/' + value);
                        })

                        setTimeout(() => {
                            currentImage.current.style.transform = "scale(1)"
                            if (currentMaskName == 'sub') {
                                subMaskRefList.map(mask => {
                                    if (mask.current) {
                                        mask.current.setStyle({
                                            transform: "scale(1)"
                                        })
                                    }
                                })
                            }

                            setTimeout(() => {
                                colorObject.current.className = 'show'
                            }, 300);

                            setTimeout(() => {
                                if (currentMaskNum == maskPathList.length - 1) {
                                }
                                else {

                                    if (currentMaskName == 'sub') {
                                        subMaskRefList.map(mask => {
                                            if (mask.current) {

                                                setTimeout(() => {
                                                    mask.current.setClass('hide')
                                                }, 500);
                                            }
                                        })
                                        subMaskNum++
                                    }

                                    currentMaskNum++;

                                    currentMaskName = maskPathList[currentMaskNum]
                                    if (currentMaskName != 'sub')
                                        blackWhiteObject.current.style.WebkitMaskImage = 'url("' +
                                            returnImgPath(maskPathList[currentMaskNum], true) + '")'
                                    else
                                        subMarkInfoList[subMaskNum].map((value, index) => {
                                            subMaskRefList[index].current.setMask(returnImgPath(value.p, true))
                                        })

                                    blackWhiteObject.current.className = 'hide'
                                    setTimeout(() => {
                                        showIndividualImage()
                                    }, 2000);

                                }
                            }, 500);
                        }, 2000);
                    }

                    else {
                        audioList.bodyAudio1.pause()
                        setTimeout(() => {
                            colorObject.current.className = 'show'
                        }, 300);
                        currentImage.current.style.transform = "scale(1)"

                        setTimeout(() => {

                            baseObject.current.style.transition = '2s'

                            baseObject.current.style.transform =
                                'translate(' + '0%,0%)' +
                                'scale(1)'

                            setTimeout(() => {
                                audioList.bodyAudio1.play()
                            }, 1500);

                            setTimeout(() => {
                                nextFunc()
                            }, 8000);
                        }, 500);
                    }



                }, timeDuration);
            }, 1000);

        }, durationList[currentMaskNum] * 1000);
    }

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={returnImgPath('grey_bg', true)}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' +
                                returnImgPath(maskPathList[2][0], true)
                                + '")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <div
                            ref={currentImage}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            <BaseImage
                                url={'bg/base.png'}
                            />
                        </div>
                    </div>

                    {
                        isSubMaskLoaded && subMarkInfoList[1].map((value, index) =>
                            <MaskComponent
                                ref={subMaskRefList[index]}
                                maskPath={returnImgPath(value.p, true)}
                            />

                        )
                    }
                    {
                        isSubMaskLoaded && ['16', '17', '18'].map((value, index) =>
                            <MaskComponent
                                ref={subMaskRefList[index + 2]}
                                maskPath={returnImgPath(value, true)}
                            />

                        )
                    }

                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <BaseImage
                            onLoad={bgLoaded}
                            url={'bg/base.png'}
                        />
                    </div>

                    {
                        wordTextList.map((value, index) =>
                            <BaseImage
                                className='hideObject'
                                ref={value}
                                scale={0.18}
                                posInfo={{
                                    l: 0.77,
                                    t: 0.35,
                                }}
                                url={'intro/t' + (index + 1) + '.png'}
                            />
                        )

                    }
                </div>
            }
        </div >
    );
});

export default Scene;
