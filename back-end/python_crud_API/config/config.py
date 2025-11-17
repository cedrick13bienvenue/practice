import os


class Config:
    """Base configuration"""
    DATA_FILE = os.path.join(os.path.dirname(
        os.path.dirname(__file__)), 'data', 'data.json')
    HOST = '127.0.0.1'
    PORT = 8000
    DEBUG = False


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


# Default configuration
config = DevelopmentConfig()
