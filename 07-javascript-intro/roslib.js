// Creating a new object of class ROSLIB.Ros
// It gets an object as argument {} that should contain the property "url"
var ros = new ROSLIB.Ros({
    url: 'wss://i-0e9d33036103f2ec1.robotigniteacademy.com/5b7c24b7-5251-47fe-af5d-307ecd203dd7/rosbridge/'
});

// Calling method "on" to define callbacks based on events
ros.on('connection', function () {
    console.log('Connected to websocket server.');
});
ros.on('error', function (error) {
    console.log('Error connecting to websocket server: ', error);
});
ros.on('close', function () {
    console.log('Connection to websocket server closed.');
});

// Creating a function that uses the object
const sendTopicMsg = (topic_name, x, z) => {
    // Creating a new object of class ROSLIB.Topic
    // It gets an object as argument {} that should contain the properties "ros", "name" and "messageType"
    var topic = new ROSLIB.Topic({
        ros: ros,
        name: topic_name,
        messageType: 'geometry_msgs/Twist'
    })

    // Creating a new object of class ROSLIB.Message
    // it gets an object as argument {}
    var msg = new ROSLIB.Message({
        linear: { x, y: 0, z: 0 },
        angular: { x: 0, y: 0, z },
    })

    // Call the method "public" of the object "topic" passing the object "msg" as argument
    topic.publish(msg)
}