toggleBtn.addEventListener('click', ()=> {
    toggleWebcam()
    if(toggleBtn.classList.contains('startBtn')) {
        toggleBtn.innerText = 'Stop webcam';
        toggleBtn.classList.add('stopBtn');
        toggleBtn.classList.remove('startBtn');  
        webcam.classList.remove('webcamDisplay');
      }
    else {
        toggleBtn.innerText = 'Start webcam';
        toggleBtn.classList.add('startBtn');
        toggleBtn.classList.remove('stopBtn');
        webcam.classList.add('webcamDisplay');
    }
})

let webcamRunning = false;

async function toggleWebcam() {
    const action = webcamRunning ? 'stop' : 'start';
    const webcamElement = document.getElementById('webcam');
    const response = await fetch('/toggle_webcam', {
        method: 'POST',
        body: JSON.stringify({ action }),
        headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (data.status === 'success') {
        if (data.webcam_active === true) {
            webcamElement.src = '/toggle_webcam';
            webcamRunning = data.webcam_active;
        } else if (data.webcam_active === false) {
            const videoElement = document.getElementById('webcam');
            webcamElement.src = '';
            webcamRunning = data.webcam_active;
        }
    } else if (data.status === 'error') {
        alert(data.message);
    }
}

var canvas = document.getElementById('canvas');
var cntx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function Circle(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;

        this.draw = () => {
            cntx.beginPath();
            cntx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            cntx.fillStyle = 'white';
            cntx.fill();
        }

        this.update = () => {
            if(this.x + this.radius > innerWidth || this.x - this.radius < 0) {
                this.dx = -this.dx
            }

            if(this.y + this.radius > innerHeight || this.y - this.radius < 0) {
                this.dy = -this.dy
            }

            this.x += this.dx;
            this.y += this.dy;

            this.draw();
        }
    }
   
    var circleArr = [];

    for (let i = 0; i <= 500; i++) {
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;
        var dx = (Math.random() - 0.5) * 1.5;
        var dy = (Math.random() - 0.5) * 1.5;
        var radius = 2;
        circleArr.push(new Circle(x, y, dx, dy, radius))
    }

    function animate() {
        requestAnimationFrame(animate);
        cntx.clearRect(0, 0, innerWidth, innerHeight); 
        for(let i = 0; i < circleArr.length; i++) {
            circleArr[i].update();
        }
    }

    animate();
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);
