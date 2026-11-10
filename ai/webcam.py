import os
os.environ["OPENCV_VIDEOIO_MSMF_ENABLE_HW_TRANSFORMS"] = "1"

import cv2
import time
import requests
from collections import Counter
from ultralytics import YOLO

MODEL_PATH = "best.pt"
BACKEND_URL = "http://localhost:3000/api/detections"
CONFIDENCE_THRESHOLD = 0.5
SEND_INTERVAL = 0.5

model = YOLO(MODEL_PATH)

cap = None
index = 1
temp_cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
if temp_cap.isOpened():
    ret, test_frame = temp_cap.read()
    if ret and test_frame is not None:
        cap = temp_cap
        break
temp_cap.release()

if cap is None:
    print("Could not read from any camera")
    exit()

last_sent_time = 0

while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        time.sleep(0.05)
        continue

    frame = cv2.resize(frame, (1280, 720))

    results = model(frame, conf=CONFIDENCE_THRESHOLD, verbose=False)

    annotated_frame = results[0].plot()
    cv2.imshow("SmartBox Live YOLO Feed", annotated_frame)

    current_time = time.time()
    if current_time - last_sent_time >= SEND_INTERVAL:
        last_sent_time = current_time

        detected_classes = []
        for box in results[0].boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            detected_classes.append(class_name)

        item_counts = dict(Counter(detected_classes))

        try:
            requests.post(
                BACKEND_URL,
                json={"items": item_counts},
                timeout=0.5
            )
            print(f"Sent to SmartBox backend: {item_counts}")
        except requests.exceptions.RequestException as e:
            print(f"Backend unreachable: {e}")

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()