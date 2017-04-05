program_NAME := GameServer
program_C_SRCS := $(wildcard *.c)
program_CXX_SRCS := $(wildcard *.cpp) $(wildcard sha1-master/*.cpp) $(wildcard json11-master/*.cpp)
program_HXX_SRCS := $(wildcard sha1-master/*.hpp)
program_HXX_SRCS := $(wildcard json11-master/*.hpp)
program_C_OBJS := ${program_C_SRCS:.c=.o}
program_CXX_OBJS := ${program_CXX_SRCS:.cpp=.o}
program_HXX_OBJS := ${program_HXX_SRCS:.hpp=.o}
program_OBJS := $(program_C_OBJS) $(program_CXX_OBJS)
program_INCLUDE_DIRS := sha1-master/ json11-master/
program_LIBRARY_DIRS :=
program_LIBRARIES :=

CPPFLAGS += $(foreach includedir,$(program_INCLUDE_DIRS),-I $(includedir)) -Wall -std=c++14 -pthread
LDFLAGS += $(foreach librarydir,$(program_LIBRARY_DIRS),-L$(librarydir))
LDFLAGS += $(foreach library,$(program_LIBRARIES),-l$(library))

.PHONY: all clean distclean

all: $(program_NAME)

$(program_NAME): $(program_OBJS) $(program_HXX_SRCS)
	$(LINK.cc) $(program_OBJS) -o $(program_NAME)

clean:
	@- $(RM) $(program_NAME)
	@- $(RM) $(program_OBJS)

distclean: clean