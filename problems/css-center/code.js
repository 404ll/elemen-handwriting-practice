// 1. flex
/*
.parent {
    display: flex;
    justify-content: center;
    align-items: center;
}
*/

// 2. grid
/*
.parent {
    display: grid;
    place-items: center;
}
*/

// 3. absolute + transform
/*
.parent {
    position: relative;
}

.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
*/

// 4. absolute + margin auto
/*
.parent {
    position: relative;
}

.child {
    position: absolute;
    inset: 0;
    margin: auto;
}
*/

// 5. table-cell
/*
.parent {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.child {
    display: inline-block;
}
*/
