from flask import Flask, session, escape, redirect, url_for, request

app = Flask(__name__)
app.secret_key = "aesudiygfewrygfonwaaegmyfweofywefg"


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
        return redirect(url_for('index'))
    return '''
        <form method="post">
        <input type="text" name="username">
        <input type="submit" value="Login">
        </form>
    '''

@app.route('/online')
def online():
    for 

if __name__ == '__main__':
    app.run()


