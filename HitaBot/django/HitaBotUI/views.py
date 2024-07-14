from django.shortcuts import render


def show_chatbot(request):
    return render(request, "index.html")
