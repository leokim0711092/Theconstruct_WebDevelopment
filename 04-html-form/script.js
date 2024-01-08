// Connecting to ROS
// -----------------

var ros = new ROSLIB.Ros({
    url: 'wss://i-0bde04f37a8fdd657.robotigniteacademy.com/1fe4df6f-acb7-45f9-9e92-88a610bab75d/rosbridge/'
});
ros.on('connection', function () {
    console.log('Connected to websocket server.');
});
ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
});
ros.on('close', function () {
    console.log('Connection to websocket server closed.');
});

document.onreadystatechange = () => {
    if (document.readyState == 'complete') {
        const form = document.getElementById('form')
        form.onsubmit = (e) => {
            e.preventDefault()
        }

        const btnSet = document.getElementById('btn_set')
        btnSet.onclick = (e) => {
            const x = +document.getElementById('linear_x').value
            const z = +document.getElementById('angular_z').value
            const topic = document.getElementById('topic_name').value
            sendTopicMsg(topic, x, z)
            e.preventDefault()
        }

        const btnStop = document.getElementById('btn_stop')
        btnStop.onclick = (e) => {
            const topic = document.getElementById('topic_name').value
            sendTopicMsg(topic, 0, 0)
            e.preventDefault()
        }
    }
}

const sendTopicMsg = (topic, x, z) => {
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: topic,
        messageType: 'geometry_msgs/Twist'
    })
    var msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })
    topic.publish(msg)
}

// end