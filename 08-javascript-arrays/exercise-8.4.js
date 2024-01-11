// Connecting to ROS
// -----------------

let ros
let btnConnect, btnCircles, btnAhead, btnStop, btnReadLaser
let txtRosbridgeAddress
let msgError
let spanMax, spanMin, spanMean

let laserScanSubscriber

const connect = (e) => {
    e.preventDefault()
    console.log(txtRosbridgeAddress.value)
    try {
        ros = new ROSLIB.Ros({
            url: txtRosbridgeAddress.value
        });
    } catch (ex) {
        evalState(2, 'Check if you entered a valid address')
    }
    ros.on('connection', function () {
        console.log('Connected to websocket server.');
        evalState(1)
        setupSubscriber()
    });
    ros.on('error', function (error) {
        evalState(2, error)
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', function () {
        evalState(0)
        console.log('Connection to websocket server closed.');
    });
}
const evalState = (state, err = null) => {
    if (state == 1) {
        btnCircles.disabled = false
        btnAhead.disabled = false
        btnStop.disabled = false
        msgError.innerHTML = ''
    } else {
        btnCircles.disabled = true
        btnAhead.disabled = true
        btnStop.disabled = true
        msgError.innerHTML = ''

        spanMax.innerHTML = '-'
        spanMin.innerHTML = '-'
        spanMean.innerHTML = '-'

        if (state == 2) {
            msgError.innerHTML = err
        }
    }
}
const circles = (e) => {
    e.preventDefault()
    sendTopicMsg(0.5, 0.5)
}
const ahead = (e) => {
    e.preventDefault()
    sendTopicMsg(0.3, 0)
}
const stop = (e) => {
    e.preventDefault()
    sendTopicMsg(0.0, 0)
}
const sendTopicMsg = (x, z) => {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    })
    var msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })
    topic.publish(msg)
}
const setupSubscriber = () => {
    laserScanSubscriber = new ROSLIB.Topic({
        ros: ros,
        name: '/scan',
        messageType: 'sensor_msgs/LaserScan'
    })
    laserScanSubscriber.subscribe((msg) => {
        updateLaserValues(msg)
        laserScanSubscriber.unsubscribe()
    })
}
const updateLaserValues = (msg) => {
    let maxAllowed = msg.range_max
    let minAllowed = msg.range_min
    let max = minAllowed, min = maxAllowed, mean = 0

    console.log(minAllowed, maxAllowed)

    const filteredArray = msg.ranges.filter(r => {
        return (
            r >= minAllowed &&
            r <= maxAllowed &&
            r != null
        )
    })
    console.log(filteredArray.length)
    for (range of filteredArray) {
        if (range > max) max = range
        if (range < min) min = range
    }
    // avoid division by zero if no value is valid
    let divider = 1
    if (filteredArray.length > 1) {
        divider = filteredArray.length
    }
    mean = filteredArray.reduce((acc, range) => acc + range, 0) / divider

    spanMin.innerHTML = min.toFixed(2)
    spanMax.innerHTML = max.toFixed(2)
    spanMean.innerHTML = mean.toFixed(2)
}

// set events
document.onreadystatechange = () => {
    btnConnect = document.getElementById('btnConnect')
    btnCircles = document.getElementById('btnCircles')
    btnAhead = document.getElementById('btnAhead')
    btnStop = document.getElementById('btnStop')
    btnReadLaser = document.getElementById('btnReadLaser')

    txtRosbridgeAddress = document.getElementById('txt_rosbridge_address')

    msgError = document.getElementById('msg_error')

    spanMax = document.getElementById('maximum')
    spanMin = document.getElementById('minimum')
    spanMean = document.getElementById('mean')

    evalState(0)

    if (document.readyState == 'complete') {
        btnConnect.onclick = connect
        btnCircles.onclick = circles
        btnAhead.onclick = ahead
        btnStop.onclick = stop
        btnReadLaser.onclick = (e) => {
            e.preventDefault()
            setupSubscriber()
        }
    }
}