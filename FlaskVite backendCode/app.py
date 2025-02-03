from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

# App configuration
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///db1.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Task Model
class Mytask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    comelete = db.Column(db.Boolean, default=False)  # Fixed typo
    created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"Task {self.id}"

# Add & Fetch Tasks
@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        current_task = request.form["content"]
        new_task = Mytask(content=current_task)
        try:
            db.session.add(new_task)
            db.session.commit()
            return jsonify({"id": new_task.id, "message": "Task added successfully!"}), 201
        except Exception as e:
            return jsonify({"error": f"Error: {e}"}), 400

    elif request.method == "GET":
        tasks = Mytask.query.order_by(Mytask.created).all()
        task_list = [{
            "id": task.id,
            "content": task.content,
            "complete": task.comelete,
            "created": task.created
        } for task in tasks]
        return jsonify(task_list)

# Delete Task
@app.route("/delete/<int:id>", methods=["DELETE"])
def delete(id):  # Fixed function signature
    delete_task = Mytask.query.get_or_404(id)
    try:
        db.session.delete(delete_task)
        db.session.commit()
        return jsonify({"message": "Task deleted successfully!"}), 200  # Added response
    except Exception as e:
        return jsonify({"error": f"Error: {e}"}), 400
    
# @app.route("/update/<int:id>", methods=["PUT"])
# def update(id):
#     task=Mytask.query.get_or_404(id)
#     if request.method=="PUT":
#         task.content=request.form["content"]
#         try:
#             db.session.commit()
#             return "Task updated successfully!"
#         except Exception as e:
#             return f"ERROR:{e}"
@app.route("/update/<int:id>", methods=["PUT"])
def update(id):
    task = Mytask.query.get_or_404(id)
    updated_content = request.form.get("content")
    
    if updated_content:
        task.content = updated_content
        try:
            db.session.commit()
            return jsonify({"message": "Task updated successfully!"}), 200
        except Exception as e:
            return jsonify({"error": f"Error: {e}"}), 400
    else:
        return jsonify({"error": "No content provided"}), 400

    

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
