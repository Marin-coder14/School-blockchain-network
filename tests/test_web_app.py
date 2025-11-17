from web_app import app


def test_generate_endpoint():
    client = app.test_client()
    rv = client.post('/generate', data={'text': 'pytest web'})
    assert rv.status_code == 200
    assert rv.content_type == 'image/png'
    assert len(rv.data) > 100  # should be non-trivial image data
