import os

target_dir = 'd:/anigravity_project_rahul/arogyasahayak/ml-backend/predictors'
for f in os.listdir(target_dir):
    if f.endswith('.py'):
        path = os.path.join(target_dir, f)
        with open(path, 'r') as file:
            content = file.read()
        
        content = content.replace("action = 'routine'", "action = 'monitor'")
        content = content.replace("action = 'preventive'", "action = 'consult_doctor'")
        content = content.replace("action = 'urgent'", "action = 'urgent_care'")
        
        with open(path, 'w') as file:
            file.write(content)

models_path = 'd:/anigravity_project_rahul/arogyasahayak/ml-backend/models.py'
with open(models_path, 'r') as file:
    content = file.read()
content = content.replace("Literal['routine', 'preventive', 'urgent']", "Literal['monitor', 'consult_doctor', 'urgent_care']")
with open(models_path, 'w') as file:
    file.write(content)

print("Enums fixed successfully.")
