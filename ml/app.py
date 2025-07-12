from flask import Flask
from config import Config
from routes.predict_routes import predict_routes

app = Flask(__name__)
app.config.from_object(Config)
app.register_blueprint(predict_routes)

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=app.config['PORT'])
