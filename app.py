from flask import Flask, session, escape, redirect, url_for, request, render_template

app = Flask(__name__)
app.secret_key = "aesudiygfewrygfonwaaegmyfweofywefg"
online_users = []

@app.route('/')
def index():
    return 'Hello World!'


@app.route('/profiles')
def profiles():
    return 'A'


@app.route('/user')
def user():
    if 'username' in session:
        return 'Logged in as ' + escape(session['username'])
    else:
        return 'Log in here: <a>/login</a>'


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        online_users.append(session['username'])
        return redirect(url_for('index'))
    return '''
        <form method="post">
        <input type="text" name="username">
        <input type="submit" value="Login">
        </form>
    '''

@app.route('/online')
def online():
    print(session)
    print(online_users)
    return 'xD'

@app.route('/calendar')
def calender():
    return render_template("calender.html")

if __name__ == '__main__':
    app.run()


