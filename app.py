from flask import Flask,render_template,request,redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
app = Flask(__name__)
app.debug = True
app.config['SQLALCHEMY_DATABASE_URI']="sqlite:///tododb1.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db=SQLAlchemy(app)

class Todo(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(200), nullable=False)
    desc=db.Column(db.String(500))
    date_created=db.Column(db.DateTime,default=datetime.utcnow)
    
    def __repr__(self)->str:
        return f"{self.sno} - {self.title}"  
class user(db.Model):
    username=db.Column(db.String(200),primary_key=True)
    password=db.Column(db.String(200),nullable=False)
    
    def __repr__(self)->str:
        return f"{self.username} - {self.password}"
    

# db=SQLAlchemy(app)
@app.route("/")
def home():
    return "This is the Home page"



@app.route('/add',methods=['GET','POST'])
def hello_flask():
    if request.method=='POST':
        t=request.form['title'] 
        desc=request.form['desc'] 
        todo=Todo(title=t,desc=desc)
        db.session.add(todo)
        db.session.commit()
    alltodo=Todo.query.all()
    return render_template('base.html', alltodo=alltodo)
   
@app.route("/update/<int:sno>",methods=['GET','POST'])
def update(sno):
    if request.method=='POST':
       todo=Todo.query.filter_by(sno=sno).first()
       todo.title=request.form['title']
       todo.desc=request.form['desc']
       db.session.add(todo)
       db.session.commit()
       return redirect("/add")       
    todoall=Todo.query.filter_by(sno=sno).first()
    return render_template('update.html',todoall=todoall)

@app.route("/about")
def about():
    return "ABout us"



@app.route("/delete/<int:sno>")
def delete(sno):
    dlt=Todo.query.filter_by(sno=sno).first()
    db.session.delete(dlt)
    db.session.commit()
    return redirect("/add")




if __name__=="__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True,port=8000)