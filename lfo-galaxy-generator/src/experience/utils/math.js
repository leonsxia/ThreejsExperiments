const lerp3Bands = function (b1, b2, b3, t, target) {

    t = Math.max(0, Math.min(1, t));

    if (t <= 0.5) {

        const localT = t * 2;
        target.copy(b1).lerp(b2, localT);

    } else {

        const localT = (t - 0.5) * 2;
        target.copy(b2).lerp(b3, localT);

    }

    return target;

}

export { lerp3Bands };